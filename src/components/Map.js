import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

function AddPinOnClick({ onAddPin, onDeletePin }) {
  const [newPin, setNewPin] = useState(null)

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setNewPin({ lat, lng, remarks: '' })
    },
  })

  const handleRemarkChange = (e) => {
    setNewPin(prev => ({ ...prev, remarks: e.target.value }))
  }

  const handleSavePin = () => {
    if (newPin) {
      onAddPin(newPin)
      setNewPin(null)
    }
  }

  const handleDeletePin = () => {
    if (newPin && newPin.id) {
      onDeletePin(newPin.id)
    }
    setNewPin(null)
  }

  return newPin ? (
    <Marker position={[newPin.lat, newPin.lng]}>
      <Popup onClose={() => setNewPin(null)}>
        <div className="w-64">
          <textarea
            value={newPin.remarks}
            onChange={handleRemarkChange}
            placeholder="Enter remarks..."
            className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
          />
          <div className="flex justify-between">
            <button 
              onClick={handleSavePin}
              className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
            >
              Save Pin
            </button>
            {newPin.id && (
              <button 
                onClick={handleDeletePin}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Delete Pin
              </button>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  ) : null
}

function PinMarker({ pin, onUpdateRemarks, onDeletePin, isSelected }) {
  const markerRef = useRef(null)
  const popupRef = useRef(null)
  const map = useMap()
  const [remarks, setRemarks] = useState(pin.remarks)

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup()
      map.setView([pin.lat, pin.lng], map.getZoom())
    }
  }, [isSelected, map, pin])

  useEffect(() => {
    setRemarks(pin.remarks)
  }, [pin.remarks])

  const handleDelete = () => {
    onDeletePin(pin.id)
    if (popupRef.current) {
      popupRef.current.close()
    }
  }

  const handleSaveChanges = () => {
    onUpdateRemarks(pin.id, remarks)
    if (popupRef.current) {
      popupRef.current.close()
    }
  }

  return (
    <Marker 
      ref={markerRef}
      position={[pin.lat, pin.lng]}
    >
      <Popup ref={popupRef}>
        <div className="w-64">
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks..."
            className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
          />
          <p className="text-sm text-gray-600 mb-2"><strong>Address:</strong> {pin.address}</p>
          <div className="flex justify-between">
            <button 
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Save Changes
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Delete Pin
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

export default function Map({ pins, onAddPin, onUpdateRemarks, onDeletePin, selectedPin }) {
  const mapCenter = [51.505, -0.09]

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-2x.png',
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
    })
  }, [])

  return (
    <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <AddPinOnClick onAddPin={onAddPin} onDeletePin={onDeletePin} />
      {pins.map(pin => (
        <PinMarker 
          key={pin.id}
          pin={pin}
          onUpdateRemarks={onUpdateRemarks}
          onDeletePin={onDeletePin}
          isSelected={selectedPin && selectedPin.id === pin.id}
        />
      ))}
    </MapContainer>
  )
}