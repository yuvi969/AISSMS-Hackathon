import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAQI } from "../api.js"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { 
  AlertTriangle, Activity, ArrowLeft, AlertCircle, 
  CheckCircle, XCircle, RefreshCw, MapPin
} from 'lucide-react'
import Navbar from "../Components/Navbar"

const AQI = () => {
  const navigate = useNavigate()
  const [aqiData, setAqiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data when page loads
  useEffect(() => {
    fetchAQIData()
  }, [])

  const fetchAQIData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Call your backend API
      const response = await getAQI(19.076, 72.877) // Mumbai coordinates
      
      // Check if successful
      if (response.data.success) {
        setAqiData(response.data)
      } else {
        setError('Failed to fetch data')
      }
    } catch (err) {
      console.error('Error fetching AQI:', err)
      setError('Cannot connect to backend. Make sure Flask server is running on localhost:5000')
    } finally {
      setLoading(false)
    }
  }

  // AQI color configuration
  const getAQIConfig = (aqi) => {
    const configs = {
      1: { label: 'Good', color: 'bg-green-500', emoji: '😊' },
      2: { label: 'Fair', color: 'bg-blue-500', emoji: '🙂' },
      3: { label: 'Moderate', color: 'bg-yellow-500', emoji: '😐' },
      4: { label: 'Poor', color: 'bg-orange-500', emoji: '😷' },
      5: { label: 'Very Poor', color: 'bg-red-500', emoji: '🚫' }
    }
    return configs[aqi] || configs[4]
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center mt-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-xl">Loading AQI data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center mt-40 px-6">
          <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-8 max-w-2xl text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
            <h2 className="text-3xl font-bold mb-4">Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="space-x-4">
              <button 
                onClick={fetchAQIData}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg"
              >
                <RefreshCw className="inline mr-2" size={20} />
                Retry
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No data
  if (!aqiData || !aqiData.data) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <p className="text-xl">No data available</p>
    </div>
  }

  const config = getAQIConfig(aqiData.data.aqi)
  const { data, recommendations } = aqiData

  // Prepare chart data
  const pollutants = [
    { name: 'PM2.5', value: data.pm2_5 },
    { name: 'PM10', value: data.pm10 },
    { name: 'O3', value: data.o3 },
    { name: 'NO2', value: data.no2 },
    { name: 'SO2', value: data.so2 },
    { name: 'CO', value: data.co }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 mt-20">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Air Quality Index</h1>
            <div className="flex items-center text-gray-400">
              <MapPin className="mr-1" size={18} />
              <span>{data.lat.toFixed(3)}°, {data.lon.toFixed(3)}°</span>
            </div>
          </div>
          <button
            onClick={fetchAQIData}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center"
          >
            <RefreshCw className="mr-2" size={18} />
            Refresh
          </button>
        </div>

        {/* Main AQI Card */}
        <div className={`${config.color}/10 border-2 border-${config.color.split('-')[1]}-500 rounded-2xl p-8 mb-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-8xl">{config.emoji}</div>
              <div>
                <div className="text-6xl font-bold">{data.aqi}</div>
                <div className={`text-2xl font-semibold text-${config.color.split('-')[1]}-500`}>
                  {config.label}
                </div>
              </div>
            </div>
            <div className={`${config.color} rounded-full w-32 h-32 flex items-center justify-center`}>
              <Activity size={64} className="text-white" />
            </div>
          </div>
        </div>

        {/* Alerts */}
        {recommendations.alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <AlertTriangle className="mr-2 text-red-500" size={28} />
              Alerts
            </h2>
            {recommendations.alerts.map((alert, idx) => (
              <div key={idx} className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 mb-3 flex items-start">
                <AlertCircle className="text-red-500 mr-3 mt-1" size={24} />
                <p className="text-lg">{alert}</p>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h3 className="text-xl font-semibold mb-3">Summary</h3>
          <p className="text-gray-300 text-lg">{recommendations.summary}</p>
        </div>

        {/* Actions & Avoid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <CheckCircle className="mr-2 text-green-500" size={28} />
              What to Do
            </h2>
            <ul className="space-y-3">
              {recommendations.actions.map((action, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-300">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <XCircle className="mr-2 text-red-500" size={28} />
              What to Avoid
            </h2>
            <ul className="space-y-3">
              {recommendations.avoid.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-red-500 mr-3 text-xl">✗</span>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Groups at Risk */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <AlertCircle className="mr-2 text-orange-500" size={28} />
            Groups at Risk
          </h2>
          <div className="flex flex-wrap gap-3">
            {recommendations.groups_at_risk.map((group, idx) => (
              <span key={idx} className="bg-orange-500/20 border border-orange-500 px-4 py-2 rounded-full">
                {group}
              </span>
            ))}
          </div>
        </div>

        {/* Pollutants Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Pollutant Levels</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={pollutants}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value) => `${value.toFixed(2)} µg/m³`}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}

export default AQI