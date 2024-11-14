'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { fetchAddress, savePinToLocalStorage, getPinsFromLocalStorage } from '../utils/helpers'
import ThemeToggle from '../components/ThemeToggle'

const MapWithNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false
})

export default function Home() {
  const [pins, setPins] = useState([])
  const [selectedPin, setSelectedPin] = useState(null)

  useEffect(() => {
    const savedPins = getPinsFromLocalStorage()
    setPins(savedPins)
  }, [])

  const handleAddPin = async (newPin) => {
    const address = await fetchAddress(newPin.lat, newPin.lng)
    const pinWithId = {
      ...newPin,
      id: Date.now(),
      address
    }
    const updatedPins = [...pins, pinWithId]
    setPins(updatedPins)
    savePinToLocalStorage(updatedPins)
  }

  const handleUpdateRemarks = (id, remarks) => {
    const updatedPins = pins.map(pin => 
      pin.id === id ? { ...pin, remarks } : pin
    )
    setPins(updatedPins)
    savePinToLocalStorage(updatedPins)
    if (selectedPin && selectedPin.id === id) {
      setSelectedPin({ ...selectedPin, remarks })
    }
  }

  const handleDeletePin = (id) => {
    const updatedPins = pins.filter(pin => pin.id !== id)
    setPins(updatedPins)
    savePinToLocalStorage(updatedPins)
    if (selectedPin && selectedPin.id === id) {
      setSelectedPin(null)
    }
  }

  const handlePinSelect = (pin) => {
    setSelectedPin(pin)
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <ThemeToggle />
      <div className="w-1/4 p-6 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto custom-scrollbar">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white border-b pb-4">
          📍 Saved Pins
        </h1>
        {pins.map(pin => (
          <div 
            key={pin.id} 
            className={`mb-6 rounded-xl cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
              selectedPin && selectedPin.id === pin.id
                ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 shadow-md'
                : 'bg-gray-50 dark:bg-gray-700/50 hover:shadow-md'
            }`}
          >
            <div 
              className="p-4"
              onClick={() => handlePinSelect(pin)}
            >
              <p className="font-semibold text-lg text-gray-800 dark:text-white mb-3">
                {pin.remarks || 'Unnamed Location'}
              </p>
              <div className="flex items-start space-x-2">
                <svg 
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                  {pin.address}
                </p>
              </div>
            </div>
          </div>
        ))}
        {pins.length === 0 && (
          <div className="text-center py-12">
            <svg 
              className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              No pins saved yet. Click on the map to create one!
            </p>
          </div>
        )}
      </div>
      <div className="w-3/4">
        <MapWithNoSSR 
          pins={pins}
          onAddPin={handleAddPin}
          onUpdateRemarks={handleUpdateRemarks}
          onDeletePin={handleDeletePin}
          selectedPin={selectedPin}
        />
      </div>
    </div>
  )
}