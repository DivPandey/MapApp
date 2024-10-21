export async function fetchAddress(lat, lon) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
      const data = await response.json()
      return data.display_name
    } catch (error) {
      console.error('Error fetching address:', error)
      return 'Address not found'
    }
  }
  
  export function savePinToLocalStorage(pins) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pins', JSON.stringify(pins))
    }
  }
  
  export function getPinsFromLocalStorage() {
    if (typeof window !== 'undefined') {
      const pins = localStorage.getItem('pins')
      return pins ? JSON.parse(pins) : []
    }
    return []
  }