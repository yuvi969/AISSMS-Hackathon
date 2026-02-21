import axios from 'axios'

const URL = 'http://localhost:5000/api'

const getAQI = async (lat = 19.076, lon = 72.877) => {
  return await axios.get(`${URL}/aqi`, {
    params: { lat, lon }
  })

}

const getAQIForMultipleCities = async (cities) => {
  try {
    // Fetch AQI for all cities in parallel
    const promises = cities.map(city => 
      getAQI(city.lat, city.lon)
        .then(response => ({
          ...city,
          aqiData: response.data.data,
          recommendations: response.data.recommendations,
          success: true
        }))
        .catch(error => ({
          ...city,
          success: false,
          error: error.message
        }))
    )
    
    const results = await Promise.all(promises)
    return results
  } catch (error) {
    console.error('Error fetching multiple AQI data:', error)
    throw error
  }
}

export const submitTicket = async (formData) => {
  const response = await fetch(`${URL}/tickets/submit`, {
    method: "POST",
    body: formData,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to submit ticket")
  }
  return response.json()
}

export const fetchLeaderboard = async () => {
  const response = await fetch(`${URL}/users/leaderboard`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to fetch leaderboard")
  }
  return response.json() 
}

export const loginUser = async (email, password) => {
  const response = await fetch(`${URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Login failed")
  }
  return response.json() 
}

export const registerUser = async (name, email, password) => {
  const response = await fetch(`${URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Registration failed")
  }
  return response.json() 
}

export { getAQI , getAQIForMultipleCities  }