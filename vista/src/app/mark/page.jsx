"use client";

import CameraCapture from "../../components/CameraCapture";
import Protected from "../../components/Protected";
import { useState } from "react";

export default function MarkAttendancePage() {
  const [captured, setCaptured] = useState("");

  return (
    <Protected allow={["Student"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Mark Attendance</h1>
          <p className="text-sm text-foreground/70">Capture your face to mark attendance</p>
        </div>
        <div className="rounded-2xl bg-white shadow-md p-4">
          <CameraCapture onCapture={setCaptured} />
        </div>
        {captured ? (
          <div className="text-sm text-foreground/80">Image captured. Integrate with backend to upload and verify.</div>
        ) : null}
      </div>
    </Protected>
  );
}


