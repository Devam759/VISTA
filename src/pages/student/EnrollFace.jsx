import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Camera from '../../components/Camera.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../components/Toast.jsx'
import { apiFetch } from '../../utils/api.js'

export default function EnrollFace() {
  const { user, token } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const [camOn, setCamOn] = useState(false)
  const [images, setImages] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [enrolled, setEnrolled] = useState(false)

  const totalSteps = 3

  useEffect(() => {
    // Check if already enrolled (check for faceDescriptor or faceIdUrl)
    if (user?.faceIdUrl || user?.faceDescriptor) {
      setEnrolled(true)
    }
  }, [user])

  const handleCapture = (img) => {
    if (images.length < totalSteps) {
      setImages([...images, img])
      setCurrentStep(currentStep + 1)
      
      if (images.length + 1 === totalSteps) {
        setCamOn(false)
      }
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    setCurrentStep(newImages.length + 1)
  }

  const enrollFace = async () => {
    if (images.length !== totalSteps) {
      push('Please capture all 3 images', 'error')
      return
    }

    try {
      setSubmitting(true)
      const response = await apiFetch('/attendance/enroll-face', {
        method: 'POST',
        body: { faceData: images[0] }, // Send first image as primary face data
        token
      })
      
      push('Face enrolled successfully! You can now mark attendance.', 'success')
      setTimeout(() => {
        navigate('/student/dashboard')
      }, 2000)
    } catch (err) {
      push(err.message || 'Failed to enroll face', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const reEnroll = () => {
    setEnrolled(false)
    setImages([])
    setCurrentStep(1)
    setCamOn(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="text-indigo-600 hover:text-indigo-700 font-medium mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Face Enrollment</h1>
          <p className="text-gray-600 mt-2">Register your face for attendance verification</p>
        </div>

        {enrolled && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-green-900 font-semibold">Face Already Enrolled</h3>
                <p className="text-green-700 text-sm mt-1">Your face is already registered in the system.</p>
                <button
                  onClick={reEnroll}
                  className="mt-3 text-sm text-green-700 hover:text-green-800 font-medium underline"
                >
                  Re-enroll with new images
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Camera Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-gray-900">Capture Images</h2>
              {!camOn && images.length < totalSteps && (
                <button
                  onClick={() => setCamOn(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                >
                  Start Camera
                </button>
              )}
              {camOn && (
                <button
                  onClick={() => setCamOn(false)}
                  className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-all"
                >
                  Stop Camera
                </button>
              )}
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Step {Math.min(currentStep, totalSteps)} of {totalSteps}</span>
                <span className="text-indigo-600 font-medium">{Math.round((images.length / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(images.length / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            <Camera onCapture={handleCapture} active={camOn} showFaceDetection={true} />

            {!camOn && images.length === 0 && (
              <div className="mt-4 p-8 bg-gray-50 rounded-xl text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-gray-600">Click "Start Camera" to begin</p>
              </div>
            )}

            {images.length === totalSteps && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <svg className="w-8 h-8 mx-auto text-green-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-700 font-medium">All images captured!</p>
              </div>
            )}
          </div>

          {/* Instructions & Preview */}
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">Instructions</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold flex-shrink-0">1</div>
                  <p className="text-gray-700">Look straight at the camera with good lighting</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold flex-shrink-0">2</div>
                  <p className="text-gray-700">Capture 3 different angles of your face</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold flex-shrink-0">3</div>
                  <p className="text-gray-700">Remove glasses and ensure face is clearly visible</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold flex-shrink-0">4</div>
                  <p className="text-gray-700">Click "Enroll Face" when all images are captured</p>
                </div>
              </div>
            </div>

            {/* Captured Images Preview */}
            {images.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="font-semibold text-lg text-gray-900 mb-4">Captured Images</h2>
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Capture ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs text-center py-1 rounded">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                  {[...Array(totalSteps - images.length)].map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  ))}
                </div>

                {images.length === totalSteps && (
                  <button
                    onClick={enrollFace}
                    disabled={submitting}
                    className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enrolling...
                      </span>
                    ) : 'Enroll Face'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
