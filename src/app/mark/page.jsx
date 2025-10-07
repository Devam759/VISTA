"use client";

import CameraCapture from "../../components/CameraCapture";
import Protected from "../../components/Protected";
import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { markAttendance, verifyFace } from "../../lib/api";

export default function MarkAttendancePage() {
  const { token } = useAuth();
  const [captured, setCaptured] = useState("");
  const [verification, setVerification] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [marking, setMarking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleCaptured(image) {
    setCaptured(image);
    setVerification(null);
    setMessage("");
    setError("");
  }

  async function handleVerify() {
    if (!token || !captured) return;
    setVerifying(true);
    setVerification(null);
    setError("");
    setMessage("");
    try {
      const response = await verifyFace(token, { face_image: captured });
      const payload = response?.verification;
      if (!payload?.success) {
        throw new Error(payload?.reason || "Verification failed");
      }
      if (!payload.match) {
        throw new Error("Face did not match enrolled profile. Please recapture and try again.");
      }
      setVerification(payload);
      setMessage(`Face verified with confidence ${payload.confidence.toFixed(1)}%. You can now mark attendance.`);
    } catch (err) {
      setError(err.message || "Face verification failed");
    } finally {
      setVerifying(false);
    }
  }

  async function handleMarkAttendance() {
    if (!token || !verification) return;
    setMarking(true);
    setError("");
    setMessage("");
    try {
      const body = {
        verification_method: "Face",
        confidence_score: verification.confidence,
        notes: "Face verified via dashboard",
      };
      const result = await markAttendance(token, body);
      setMessage(result?.message || "Attendance marked successfully.");
    } catch (err) {
      setError(err.message || "Failed to mark attendance");
    } finally {
      setMarking(false);
    }
  }

  return (
    <Protected allow={["Student"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Mark Attendance</h1>
          <p className="text-sm text-foreground/60">Position your face in the camera frame for automatic capture</p>
        </div>
        <div className="rounded-2xl surface shadow-sm border border-[color:var(--border)] p-6">
          <CameraCapture onCapture={handleCaptured} />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={handleVerify}
            disabled={!captured || !token || verifying}
            className="btn btn-primary disabled:opacity-60"
          >
            {verifying ? "Verifying..." : "Verify Face"}
          </button>
          <button
            onClick={handleMarkAttendance}
            disabled={!verification || marking}
            className="btn disabled:opacity-60"
          >
            {marking ? "Submitting..." : "Mark Attendance"}
          </button>
        </div>

        {message ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="text-lg">✅</span>
              <span className="text-sm font-medium">{message}</span>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
            <div className="flex items-center gap-2 text-rose-700">
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        ) : null}
        {!token ? (
          <div className="text-sm text-foreground/60">
            You must be logged in to verify your face and mark attendance.
          </div>
        ) : null}
      </div>
    </Protected>
  );
}



