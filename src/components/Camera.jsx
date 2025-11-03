import React, { useEffect, useRef, useState } from 'react'

export default function Camera({ onCapture, active = false }) {
  const videoRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let stream
    const start = async () => {
      try {
        setError('')
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          const p = videoRef.current.play()
          if (p && typeof p.then === 'function') {
            p.catch(() => {})
          }
        }
      } catch (e) {
        setError(e?.message || 'Camera error')
      }
    }

    if (active) {
      start()
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject
        if (s && s.getTracks) s.getTracks().forEach(t => t.stop())
        videoRef.current.srcObject = null
      }
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [active])

  const handleCapture = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    onCapture?.(dataUrl)
  }

  return (
    <div className="w-full">
      {error ? (
        <div>
          <div className="text-red-600 text-sm">{error}</div>
          <button onClick={() => window.location.reload()} className="mt-2 px-3 py-1 border rounded text-sm hover:bg-gray-50">Retry</button>
        </div>
      ) : active ? (
        <div className="rounded-lg overflow-hidden border bg-black aspect-video">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border bg-gray-100 aspect-video grid place-items-center text-sm text-gray-500">
          Camera is off
        </div>
      )}
      <button onClick={handleCapture} disabled={!active} className="mt-3 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-60">
        Capture
      </button>
    </div>
  )
}
