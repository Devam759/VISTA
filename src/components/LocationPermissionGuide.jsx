"use client";

import { useState, useEffect } from "react";

export default function LocationPermissionGuide({ onPermissionGranted, onClose }) {
  const [permissionState, setPermissionState] = useState('checking');
  const [browserType, setBrowserType] = useState('unknown');

  useEffect(() => {
    // Detect browser type
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) {
      setBrowserType('chrome');
    } else if (userAgent.includes('Firefox')) {
      setBrowserType('firefox');
    } else if (userAgent.includes('Safari')) {
      setBrowserType('safari');
    } else if (userAgent.includes('Edge')) {
      setBrowserType('edge');
    }

    // Check current permission state
    checkPermissionState();
  }, []);

  const checkPermissionState = async () => {
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionState(permission.state);
        
        // Listen for permission changes
        permission.addEventListener('change', () => {
          setPermissionState(permission.state);
          if (permission.state === 'granted') {
            onPermissionGranted();
          }
        });
      } catch (error) {
        setPermissionState('unknown');
      }
    } else {
      setPermissionState('unknown');
    }
  };

  const getBrowserInstructions = () => {
    switch (browserType) {
      case 'chrome':
        return {
          title: 'Chrome Location Settings',
          steps: [
            'Click the lock icon (🔒) or location icon (📍) in the address bar',
            'Select "Allow" for location access',
            'If you don\'t see the option, click "Site settings"',
            'Set Location to "Allow"',
            'Refresh the page'
          ]
        };
      case 'firefox':
        return {
          title: 'Firefox Location Settings',
          steps: [
            'Click the shield icon in the address bar',
            'Click "Permissions"',
            'Set Location to "Allow"',
            'Refresh the page'
          ]
        };
      case 'safari':
        return {
          title: 'Safari Location Settings',
          steps: [
            'Go to Safari menu > Preferences',
            'Click "Websites" tab',
            'Select "Location" from the sidebar',
            'Set this website to "Allow"',
            'Refresh the page'
          ]
        };
      case 'edge':
        return {
          title: 'Edge Location Settings',
          steps: [
            'Click the lock icon (🔒) in the address bar',
            'Click "Permissions"',
            'Set Location to "Allow"',
            'Refresh the page'
          ]
        };
      default:
        return {
          title: 'Browser Location Settings',
          steps: [
            'Look for a location icon (📍) in the address bar',
            'Click it and select "Allow"',
            'If not visible, check browser settings',
            'Enable location access for this site',
            'Refresh the page'
          ]
        };
    }
  };

  const instructions = getBrowserInstructions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📍</span>
          </div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Enable Location Access</h2>
          <p className="text-gray-600">
            VISTA needs your location to verify you're on campus for attendance marking.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3">{instructions.title}</h3>
          <ol className="space-y-2">
            {instructions.steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-blue-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-yellow-800 mb-2">Device Location Services</h4>
          <p className="text-yellow-700 text-sm">
            Make sure your device's location services are enabled in your system settings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPermissionGranted}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex-1"
          >
            I've Enabled Location Access
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors flex-1"
          >
            Cancel
          </button>
        </div>

        {permissionState === 'granted' && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-green-700 text-sm">
              ✅ Location access granted! You can now use the attendance system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
