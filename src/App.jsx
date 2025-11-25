import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import AppRoutes from './router.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { Analytics } from "@vercel/analytics/react"
import { loadModels } from './utils/faceApi.js'

export default function App() {
  const [modelsLoading, setModelsLoading] = useState(true)

  useEffect(() => {
    // Load face-api.js models on app startup
    loadModels()
      .then(() => {
        setModelsLoading(false)
        console.log('✅ Face-api.js models ready')
      })
      .catch((error) => {
        console.warn('⚠️ Face-api.js models failed to load:', error)
        setModelsLoading(false)
        // App continues to work even if models fail to load
      })
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            {modelsLoading && (
              <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm z-50">
                Loading face recognition models...
              </div>
            )}
            <AppRoutes />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
