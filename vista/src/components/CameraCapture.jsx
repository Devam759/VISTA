"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const detectorRef = useRef(null);
  const [autoNote, setAutoNote] = useState("");
  const autoCapturingRef = useRef(false);

  const start = useCallback(async () => {
    setError("");
    setIsStarting(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      setStream(s);
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = s;
        await new Promise((resolve) => {
          const handler = () => {
            video.removeEventListener("loadedmetadata", handler);
            resolve();
          };
          video.addEventListener("loadedmetadata", handler, { once: true });
        });
        try {
          await video.play();
        } catch (e) {
          // Autoplay might be blocked; surface a gentle message
          setError((prev) => prev || "Press Start camera again if video didn't autoplay.");
        }
      }
    } catch (e) {
      setError(e?.message || "Camera access denied");
    } finally {
      setIsStarting(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (isStarting) return; // avoid interrupting play() startup
    if (videoRef.current) {
      try { videoRef.current.pause(); } catch {}
      videoRef.current.srcObject = null;
    }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  }, [stream, isStarting]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPhoto(dataUrl);
    if (onCapture) onCapture(dataUrl);
  }, [onCapture]);

  const resetPhoto = () => setPhoto("");

  // Automatic capture when a sufficiently large face is detected (if supported)
  useEffect(() => {
    let intervalId;
    async function ensureDetector() {
      if (typeof window !== "undefined" && "FaceDetector" in window && !detectorRef.current) {
        try {
          // eslint-disable-next-line no-undef
          detectorRef.current = new FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
        } catch (e) {
          detectorRef.current = null;
        }
      }
    }
    async function tick() {
      const video = videoRef.current;
      const detector = detectorRef.current;
      if (!video || !stream || photo || autoCapturingRef.current) return;
      if (!detector) return;
      if (!video.videoWidth || !video.videoHeight) return;
      try {
        const faces = await detector.detect(video);
        if (faces && faces.length > 0) {
          const { width, height } = faces[0].boundingBox || {};
          const frameArea = video.videoWidth * video.videoHeight;
          const boxArea = (width || 0) * (height || 0);
          const coverage = frameArea ? boxArea / frameArea : 0;
          setAutoNote(`Face coverage: ${(coverage * 100).toFixed(0)}%`);
          if (coverage > 0.12) {
            autoCapturingRef.current = true;
            // Small delay to allow user to steady
            setTimeout(() => {
              capture();
              autoCapturingRef.current = false;
            }, 250);
          }
        } else {
          setAutoNote("");
        }
      } catch (e) {
        // Ignore detection errors; keep UI responsive
      }
    }
    ensureDetector();
    if (stream && !photo) {
      intervalId = setInterval(tick, 300);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [stream, photo, capture]);

  return (
    <div className="space-y-3">
      {error ? <div className="text-sm text-rose-600">{error}</div> : null}
      {!photo ? (
        <div className="rounded-xl overflow-hidden bg-black/5">
          <video ref={videoRef} className="w-full aspect-video bg-black" playsInline muted />
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden bg-black/5">
          <img src={photo} alt="Captured" className="w-full aspect-video object-contain bg-black" />
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-2 items-center">
        {!photo ? (
          <>
            {!stream ? (
              <button onClick={start} disabled={isStarting} className="px-3 py-2 rounded-md bg-black text-white disabled:opacity-60">{isStarting ? "Starting camera..." : "Start camera"}</button>
            ) : (
              <>
                <button onClick={stop} disabled={isStarting} className="px-3 py-2 rounded-md border border-black/[.12] bg-white disabled:opacity-60">Stop</button>
                <span className="text-xs text-foreground/70">Auto-capture is active when face fills frame</span>
              </>
            )}
          </>
        ) : (
          <>
            <button onClick={resetPhoto} className="px-3 py-2 rounded-md border border-black/[.12] bg-white">Retake</button>
            <a download="capture.jpg" href={photo} className="px-3 py-2 rounded-md bg-black text-white">Download</a>
          </>
        )}
      </div>
    </div>
  );
}


