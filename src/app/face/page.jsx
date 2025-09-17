"use client";

import { useState } from "react";
import Protected from "../../components/Protected";

export default function FacePage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  function onChange(e) {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  }

  return (
    <Protected allow={["Student"]}>
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Face Enrollment</h1>
        <p className="text-sm text-foreground/70">Upload your face image for attendance system</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-black/[.08] dark:border-white/[.145] p-4">
          <div className="text-sm mb-2">Your Information</div>
          <div className="text-sm text-foreground/70">This enrollment is for your attendance verification</div>
        </div>

        <div className="rounded-lg border border-black/[.08] dark:border-white/[.145] p-4">
          <div className="text-sm mb-2">Upload face image</div>
          <input type="file" accept="image/*" onChange={onChange} />
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="mt-3 max-h-56 rounded" />
          ) : null}
        </div>
      </div>

      <div>
        <button disabled={!file} className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-50 dark:bg-white dark:text-black">Enroll My Face</button>
      </div>
    </div>
    </Protected>
  );
}


