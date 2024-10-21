'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { fetchAddress, savePinToLocalStorage, getPinsFromLocalStorage } from '../utils/helpers'

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
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 p-4 bg-white shadow-lg overflow-y-auto custom-scrollbar">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Saved Pins</h1>
        {pins.map(pin => (
          <div 
            key={pin.id} 
            className={`mb-4 p-3 rounded-lg cursor-pointer transition duration-300 ease-in-out ${
              selectedPin && selectedPin.id === pin.id
                ? 'bg-blue-100 border-l-4 border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => handlePinSelect(pin)}
          >
            <p className="font-medium text-gray-800 mb-1">
              {pin.remarks || 'No remarks'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Address:</strong> {pin.address}
            </p>
          </div>
        ))}
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