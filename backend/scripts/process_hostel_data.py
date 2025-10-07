"""Process BH-2 Hostel Allocation Data into CSV fixtures."""

from __future__ import annotations

import csv
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple


BASE_DIR = Path(__file__).resolve().parents[2]
INPUT_CSV = BASE_DIR / "public" / "FINAL SHEET OF BH-2.csv"
OUTPUT_DIR = BASE_DIR / "public" / "processed_data"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

USERS_CSV = OUTPUT_DIR / "bh2_users.csv"
STUDENTS_CSV = OUTPUT_DIR / "bh2_students.csv"
ROOMS_CSV = OUTPUT_DIR / "bh2_rooms.csv"
HOSTELS_CSV = OUTPUT_DIR / "bh2_hostels.csv"

HOSTEL_ID = 2
PASSWORD_HASH = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"  # "password"
TIMESTAMP_NOW = datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def slugify(value: str) -> str:
    """Make a simple slug with alphanumerics only."""

    return re.sub(r"[^a-z0-9]", "", value.lower())


def infer_course(reg_no: str) -> str:
    """Infer course name from registration number."""

    normalized = reg_no.replace(" ", "").upper()
    if not normalized or normalized == "0":
        return "Unknown"
    if "BTECH" in normalized:
        return "B.Tech"
    if "BBA" in normalized:
        return "BBA"
    if "BDES" in normalized:
        return "B.Des"
    if "MDES" in normalized:
        return "M.Des"
    return "B.Tech"


def infer_year_and_semester(year_label: str, existing_label: str) -> Tuple[int, int]:
    """Infer admission year and semester from textual labels."""

    label = f"{year_label} {existing_label}".lower()
    if "2" in label or "existing" in label:
        return 2024, 3
    return 2025, 1


def parse_reporting_date(raw: str) -> str:
    """Return formatted timestamp from reporting date, fallback to now."""

    raw = raw.strip()
    if not raw:
        return TIMESTAMP_NOW
    for fmt in ("%m/%d/%Y", "%m/%d/%y", "%d/%m/%Y"):
        try:
            dt = datetime.strptime(raw, fmt)
            return dt.strftime("%Y-%m-%d 00:00:00")
        except ValueError:
            continue
    return TIMESTAMP_NOW


def build_email(first: str, last: str, email_counts: Dict[str, int]) -> str:
    """Generate a unique email based on name."""

    first_slug = slugify(first) or "student"
    last_slug = slugify(last) or "user"
    base = f"{first_slug}.{last_slug}"
    count = email_counts[base]
    email_counts[base] += 1
    if count:
        return f"{base}{count}@jklu.edu.in"
    return f"{base}@jklu.edu.in"


def parse_capacity(raw: str) -> int:
    match = re.search(r"(\d+)", raw)
    return int(match.group(1)) if match else 3


def normalize_room_type(raw: str) -> str:
    raw = raw.strip().upper()
    if raw == "AC":
        return "AC"
    if raw in {"NAC", "NON AC", "NON-AC"}:
        return "Non-AC"
    return "Standard"


def is_vacant(name: str) -> bool:
    return slugify(name) in {"", "vacant", "demoroom", "demo"}


def load_rows() -> Tuple[List[str], List[Dict[str, str]]]:
    with INPUT_CSV.open("r", newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle)
        raw_rows = list(reader)

    header_idx = None
    for idx, row in enumerate(raw_rows):
        if any(cell.strip().startswith("S.No.") for cell in row):
            header_idx = idx
            break

    if header_idx is None:
        raise RuntimeError("Unable to locate header row in input CSV")

    headers = [cell.strip() for cell in raw_rows[header_idx]]
    data_rows = []

    for raw in raw_rows[header_idx + 1 :]:
        if not any(cell.strip() for cell in raw):
            continue
        padded = list(raw) + [""] * (len(headers) - len(raw))
        row_dict = {header: value.strip() for header, value in zip(headers, padded)}
        data_rows.append(row_dict)

    return headers, data_rows


def main() -> None:
    headers, rows = load_rows()

    users: List[Dict[str, object]] = []
    students: List[Dict[str, object]] = []
    rooms: Dict[str, Dict[str, object]] = {}

    email_counts: Dict[str, int] = defaultdict(int)

    user_id = 1000
    student_id = 1000

    for row in rows:
        room_number = row.get("Room NO.", "").strip()
        room_type = normalize_room_type(row.get("AC/NAC", ""))
        capacity = parse_capacity(row.get("Seater", "3"))

        if room_number:
            room_entry = rooms.setdefault(
                room_number,
                {
                    "hostel_id": HOSTEL_ID,
                    "room_number": room_number,
                    "room_type": room_type,
                    "capacity": capacity,
                    "current_occupancy": 0,
                    "is_active": True,
                    "created_at": TIMESTAMP_NOW,
                },
            )
            if room_entry["room_type"] == "Standard" and room_type != "Standard":
                room_entry["room_type"] = room_type
            room_entry["capacity"] = max(room_entry["capacity"], capacity)

        student_name = row.get("Student's Name", "").strip()
        if not student_name or is_vacant(student_name):
            continue

        registration_number = row.get("Student Reg. no", "").replace(" ", "")
        student_roll = row.get("Student Roll No.", "").replace(" ", "")
        roll_number = registration_number or student_roll
        if not roll_number:
            roll_number = f"TEMP-{slugify(student_name)[:8] or student_id}".upper()

        mobile = row.get("Mobile Number", "")

        names = student_name.split()
        first_name = names[0]
        last_name = " ".join(names[1:]) if len(names) > 1 else "Student"
        email = build_email(first_name, last_name, email_counts)

        created_at = parse_reporting_date(row.get("Reporting Date", ""))
        admission_year, semester = infer_year_and_semester(row.get("Year", ""), row.get("Existing OR", ""))

        user_record = {
            "id": user_id,
            "email": email,
            "password_hash": PASSWORD_HASH,
            "role": "Student",
            "first_name": first_name,
            "last_name": last_name,
            "phone": mobile,
            "is_active": True,
            "created_at": created_at,
        }
        users.append(user_record)

        student_record = {
            "id": student_id,
            "user_id": user_id,
            "roll_number": roll_number,
            "hostel_id": HOSTEL_ID,
            "room_id": None,
            "course": infer_course(registration_number or student_roll),
            "branch": "Unknown",
            "semester": semester,
            "admission_year": admission_year,
            "is_active": True,
            "created_at": created_at,
            "room_number": room_number,
        }
        students.append(student_record)

        if room_number and room_number in rooms:
            rooms[room_number]["current_occupancy"] += 1

        user_id += 1
        student_id += 1

    sorted_rooms = sorted(rooms.values(), key=lambda r: (int(re.sub(r"[^0-9]", "", r["room_number"]) or 0), r["room_number"]))
    room_id_map: Dict[str, int] = {}
    for idx, room in enumerate(sorted_rooms, start=1):
        room["id"] = idx
        room_id_map[room["room_number"]] = idx

    for student in students:
        room_num = student.pop("room_number", None)
        student["room_id"] = room_id_map.get(room_num)

    hostel_record = {
        "id": HOSTEL_ID,
        "name": "BH-2",
        "type": "Boys",
        "warden_name": "",
        "warden_phone": "",
        "total_rooms": len(sorted_rooms),
        "total_capacity": sum(room["capacity"] for room in sorted_rooms),
        "address": "",
        "is_active": True,
        "created_at": TIMESTAMP_NOW,
    }

    write_csv(
        USERS_CSV,
        [
            "id",
            "email",
            "password_hash",
            "role",
            "first_name",
            "last_name",
            "phone",
            "is_active",
            "created_at",
        ],
        users,
    )
    write_csv(
        ROOMS_CSV,
        [
            "id",
            "hostel_id",
            "room_number",
            "room_type",
            "capacity",
            "current_occupancy",
            "is_active",
            "created_at",
        ],
        sorted_rooms,
    )
    write_csv(
        STUDENTS_CSV,
        [
            "id",
            "user_id",
            "roll_number",
            "hostel_id",
            "room_id",
            "course",
            "branch",
            "semester",
            "admission_year",
            "is_active",
            "created_at",
        ],
        students,
    )
    write_csv(
        HOSTELS_CSV,
        [
            "id",
            "name",
            "type",
            "warden_name",
            "warden_phone",
            "total_rooms",
            "total_capacity",
            "address",
            "is_active",
            "created_at",
        ],
        [hostel_record],
    )

    print(f"Processed {len(users)} users, {len(students)} students, and {len(sorted_rooms)} rooms.")
    print(f"Output files saved to: {OUTPUT_DIR}")


def write_csv(path: Path, headers: List[str], rows: List[Dict[str, object]]) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


if __name__ == "__main__":
    main()
