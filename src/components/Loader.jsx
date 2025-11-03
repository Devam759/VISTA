import React from 'react'

export default function Loader({ label = 'Checking...', className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="loader" />
      <span className="text-gray-600">{label}</span>
    </div>
  )
}
