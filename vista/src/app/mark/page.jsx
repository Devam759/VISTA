"use client";

import CameraCapture from "../../components/CameraCapture";
import Protected from "../../components/Protected";
import { useState } from "react";

export default function MarkAttendancePage() {
  const [captured, setCaptured] = useState("");

  return (
    <Protected allow={["Student"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Mark Attendance</h1>
          <p className="text-sm text-foreground/60">Position your face in the camera frame for automatic capture</p>
        </div>
        <div className="rounded-2xl surface shadow-sm border border-[color:var(--border)] p-6">
          <CameraCapture onCapture={setCaptured} />
        </div>
        {captured ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="text-lg">✅</span>
              <span className="text-sm font-medium">Photo captured successfully! Ready to submit attendance.</span>
            </div>
          </div>
        ) : null}
      </div>
    </Protected>
  );
}


