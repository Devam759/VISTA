import React, { useEffect, useRef, useState } from 'react'
import { detectSingleFace, loadModels, areModelsLoaded } from '../utils/faceApi.js'

export default function Camera({ onCapture, active = false, showFaceDetection = true }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [error, setError] = useState('')
  const [faceDetected, setFaceDetected] = useState(false)
  const [modelsLoading, setModelsLoading] = useState(true)
  const detectionIntervalRef = useRef(null)

  // Load models on mount
  useEffect(() => {
    const initModels = async () => {
      try {
        if (!areModelsLoaded()) {
          await loadModels()
        }
        setModelsLoading(false)
      } catch (err) {
        console.error('Failed to load face-api models:', err)
        setModelsLoading(false)
        // Continue without face detection if models fail to load
      }
    }
    initModels()
  }, [])

  // Face detection loop
  useEffect(() => {
    if (!active || !showFaceDetection || modelsLoading) {
      return
    }
    
    // If models aren't loaded, skip face detection but allow camera to work
    if (!areModelsLoaded()) {
      console.warn('Face detection models not available - camera will work without face detection');
      return
    }

    const detectFace = async () => {
      if (!videoRef.current || !canvasRef.current) return

      try {
        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // Set canvas size to match video
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480

        // Detect face
        const detection = await detectSingleFace(video)

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (detection) {
          setFaceDetected(true)
          
          // Draw detection box
          const box = detection.detection.box
          ctx.strokeStyle = '#00ff00'
          ctx.lineWidth = 2
          ctx.strokeRect(box.x, box.y, box.width, box.height)

          // Draw landmarks
          const landmarks = detection.landmarks
          ctx.fillStyle = '#00ff00'
          landmarks.positions.forEach(point => {
            ctx.beginPath()
            ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI)
            ctx.fill()
          })
        } else {
          setFaceDetected(false)
        }
      } catch (err) {
        console.error('Face detection error:', err)
        setFaceDetected(false)
      }
    }

    // Run detection every 100ms
    detectionIntervalRef.current = setInterval(detectFace, 100)

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [active, showFaceDetection, modelsLoading])

  useEffect(() => {
    let stream
    const start = async () => {
      try {
        setError('')
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
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
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [active])

  const handleCapture = async () => {
    const video = videoRef.current
    if (!video) return

    // If face detection is enabled and models are loaded, verify face is detected
    if (showFaceDetection && areModelsLoaded() && !faceDetected) {
      setError('Please position your face in the camera view')
      return
    }

    // Resize image to max 800px for faster processing and smaller file size
    const MAX_SIZE = 800
    let width = video.videoWidth || 640
    let height = video.videoHeight || 480
    
    if (width > MAX_SIZE || height > MAX_SIZE) {
      if (width > height) {
        height = Math.round((height * MAX_SIZE) / width)
        width = MAX_SIZE
      } else {
        width = Math.round((width * MAX_SIZE) / height)
        height = MAX_SIZE
      }
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, width, height)
    // Use 0.85 quality for good balance between size and quality
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    onCapture?.(dataUrl)
  }

  return (
    <div className="w-full">
      {error ? (
        <div>
          <div className="text-red-600 text-sm mb-2">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 border rounded text-sm hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      ) : active ? (
        <div className="relative rounded-lg overflow-hidden border bg-black aspect-video">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover" 
          />
          {showFaceDetection && areModelsLoaded() && (
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ objectFit: 'cover' }}
            />
          )}
          {showFaceDetection && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${
                faceDetected 
                  ? 'bg-green-500 text-white' 
                  : 'bg-yellow-500 text-white'
              }`}>
                {faceDetected ? '✓ Face Detected' : '⏳ Looking for face...'}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border bg-gray-100 aspect-video grid place-items-center text-sm text-gray-500">
          Camera is off
        </div>
      )}
      <button 
        onClick={handleCapture} 
        disabled={!active || (showFaceDetection && areModelsLoaded() && !faceDetected)} 
        className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
      >
        {showFaceDetection && areModelsLoaded() && !faceDetected ? 'Position Face in Camera' : 'Capture'}
      </button>
    </div>
  )
}
