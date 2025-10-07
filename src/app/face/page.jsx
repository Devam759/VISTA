"use client";

import { useState } from "react";
import Protected from "../../components/Protected";
import CameraCapture from "../../components/CameraCapture";
import { useAuth } from "../../components/AuthProvider";
import { enrollFace } from "../../lib/api";

export default function FacePage() {
  const { token } = useAuth();
  const [captured, setCaptured] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleEnroll() {
    if (!token || !captured) return;
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await enrollFace(token, { face_image: captured });
      setMessage("Face enrolled successfully. You can now verify attendance with your face.");
    } catch (err) {
      setError(err.message || "Failed to enroll face");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Protected allow={["Student"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Face Enrollment</h1>
          <p className="text-sm text-foreground/70">
            Capture your face using the camera below. Enrollment links your face to your student profile for attendance.
          </p>
        </div>

        <div className="rounded-2xl surface shadow-sm border border-[color:var(--border)] p-6 space-y-4">
          <CameraCapture onCapture={setCaptured} />
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleEnroll}
              disabled={!captured || !token || submitting}
              className="btn btn-primary disabled:opacity-60"
            >
              {submitting ? "Enrolling..." : "Enroll My Face"}
            </button>
            {captured ? (
              <span className="text-sm text-foreground/60">
                Photo captured. Click "Enroll My Face" to submit.
              </span>
            ) : null}
          </div>
        </div>

        {message ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="text-xs text-foreground/50">
          Tip: Ensure your face is well lit and fills most of the frame. If enrollment fails, retake a clearer photo and try again.
        </div>
      </div>
    </Protected>
  );
}


