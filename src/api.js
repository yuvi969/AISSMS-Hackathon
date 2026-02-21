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

export { getAQI , getAQIForMultipleCities}