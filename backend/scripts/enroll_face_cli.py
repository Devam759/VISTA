"""Command-line tool to capture and enroll student face data using OpenCV."""
import argparse
import json
import sys
import time

try:
    import cv2  # type: ignore
    import face_recognition  # type: ignore
except ImportError as exc:  # pragma: no cover - import guard
    print("ERROR: OpenCV (opencv-python) and face_recognition packages are required.")
    print("Install dependencies with: pip install -r requirements.txt")
    raise SystemExit(1) from exc

from app import create_app
from models import db, Student, User, FaceEnrollment


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Enroll a student's face via webcam.")
    parser.add_argument("identifier", help="Student roll number or numeric ID")
    parser.add_argument(
        "--capturer-email",
        dest="capturer_email",
        default=None,
        help="Email of the warden capturing the face (used for created_by field)",
    )
    parser.add_argument(
        "--notes",
        default="CLI enrollment",
        help="Optional notes stored with the enrollment entry",
    )
    parser.add_argument(
        "--camera-index",
        dest="camera_index",
        type=int,
        default=0,
        help="Camera index passed to cv2.VideoCapture (default: 0)",
    )
    return parser.parse_args()


def resolve_student(identifier: str) -> Student:
    """Fetch student by roll number or numeric ID."""
    student = None
    if identifier.isdigit():
        student = Student.query.get(int(identifier))
    if student is None:
        student = Student.query.filter_by(roll_number=identifier.upper()).first()
    if student is None:
        raise ValueError(f"Could not find student for identifier '{identifier}'")
    return student


def resolve_capturer(email: str | None) -> int | None:
    if not email:
        return None
    user = User.query.filter_by(email=email.lower()).first()
    if not user:
        raise ValueError(f"No user found with email '{email}'")
    return user.id


def capture_face_frame(camera_index: int = 0):
    """Capture a single frame with a face encoding from webcam."""
    print("Connecting to camera... Press 'c' to capture frame, 'q' to quit.")
    video = cv2.VideoCapture(camera_index)
    if not video.isOpened():
        raise RuntimeError("Unable to access webcam. Check camera permissions.")

    captured_encoding = None
    captured_frame = None
    try:
        while True:
            ret, frame = video.read()
            if not ret:
                continue

            display_frame = frame.copy()
            rgb_frame = display_frame[:, :, ::-1]
            face_locations = face_recognition.face_locations(rgb_frame)

            for (top, right, bottom, left) in face_locations:
                cv2.rectangle(display_frame, (left, top), (right, bottom), (0, 255, 0), 2)

            cv2.putText(
                display_frame,
                "Press 'c' to capture, 'q' to quit",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0),
                2,
                cv2.LINE_AA,
            )

            cv2.imshow("Face Enrollment", display_frame)
            key = cv2.waitKey(1) & 0xFF

            if key == ord("c"):
                if not face_locations:
                    print("No face detected. Adjust position and try again.")
                    continue
                face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
                if not face_encodings:
                    print("Failed to extract encoding. Try again.")
                    continue
                captured_encoding = face_encodings[0]
                captured_frame = frame
                print("Face captured successfully.")
                break
            if key == ord("q"):
                print("Capture cancelled by user.")
                break
    finally:
        video.release()
        cv2.destroyAllWindows()

    if captured_encoding is None or captured_frame is None:
        raise RuntimeError("No face captured. Exiting without enrollment.")

    return captured_encoding, captured_frame


def compute_quality_score(encoding) -> float:
    """Return a simple quality score based on encoding magnitude."""
    norm = float(sum(v * v for v in encoding))
    return min(100.0, norm / len(encoding) * 100)


def save_enrollment(student: Student, encoding, created_by: int | None, notes: str):
    enrollment = FaceEnrollment(
        student_id=student.id,
        face_encoding_data=json.dumps(list(map(float, encoding))),
        confidence_score=95.0,
        face_quality_score=compute_quality_score(encoding),
        enrollment_method="CLI",
        created_by=created_by,
        notes=notes,
    )
    db.session.add(enrollment)
    db.session.commit()
    return enrollment


def main():
    args = parse_args()

    app = create_app()
    with app.app_context():
        try:
            student = resolve_student(args.identifier)
        except ValueError as exc:
            print(f"ERROR: {exc}")
            raise SystemExit(1) from exc

        capturer_id = None
        try:
            capturer_id = resolve_capturer(args.capturer_email)
        except ValueError as exc:
            print(f"ERROR: {exc}")
            raise SystemExit(1) from exc

        print(
            f"Enrolling face for student '{student.user.first_name} {student.user.last_name}' "
            f"(Roll: {student.roll_number}, Hostel: {student.hostel.name if student.hostel else 'N/A'})"
        )
        time.sleep(0.5)

        try:
            encoding, frame = capture_face_frame(args.camera_index)
        except RuntimeError as exc:
            print(f"ERROR: {exc}")
            raise SystemExit(1) from exc

        try:
            enrollment = save_enrollment(student, encoding, capturer_id, args.notes)
        except Exception as exc:  # pragma: no cover - DB errors
            db.session.rollback()
            print(f"ERROR: Failed to save enrollment: {exc}")
            raise SystemExit(1) from exc

        print("Enrollment saved with ID:", enrollment.id)
        print("Confidence score:", enrollment.confidence_score)
        print("Quality score:", enrollment.face_quality_score)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nInterrupted by user. Goodbye!", file=sys.stderr)
        raise SystemExit(1)
