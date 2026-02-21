import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts'
import { 
  Droplets, ArrowLeft, AlertCircle, CheckCircle, 
  TrendingUp, TrendingDown, Minus, MapPin, Calendar,
  Info, AlertTriangle, ThumbsUp
} from 'lucide-react'
import Navbar from "../Components/Navbar"

const Water = () => {
  const navigate = useNavigate()
  const [waterData, setWaterData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch data from your backend
  useEffect(() => {
    const fetchWaterData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('YOUR_WATER_API_ENDPOINT_HERE')
        const data = await response.json()
        setWaterData(data[0]) // Assuming array with single object
        setLoading(false)
      } catch (error) {
        console.error('Error fetching water data:', error)
        // Use mock data for demo
        setWaterData(mockData[0])
        setLoading(false)
      }
    }

    fetchWaterData()
  }, [])

  // Mock data (matches your API structure)
  const mockData = [
    {
      "16-Apr": 8.5,
      "16-Aug": 5.4,
      "16-Dec": 5.7,
      "16-Jul": 7.0,
      "16-Jun": 11.5,
      "16-Mar": 5.5,
      "16-May": 10.4,
      "16-Nov": 8.5,
      "16-Oct": 10.75,
      "16-Sep": 6.25,
      "17-Feb": 11.25,
      "17-Jan": 11.2,
      "Average (mg/L)": 8.5,
      "City": "Pune",
      "Locations": "1.Khadakwasla"
    }
  ]

  // Water Quality Configuration based on Dissolved Oxygen (DO) levels
  const getWaterQualityConfig = (doLevel) => {
    if (doLevel >= 8.0) {
      return {
        level: 'Excellent',
        color: 'bg-blue-500',
        textColor: 'text-blue-500',
        bgLight: 'bg-blue-500/10',
        emoji: '💎',
        description: 'Water quality is excellent. Safe for all uses.',
        status: 'excellent'
      }
    } else if (doLevel >= 6.0) {
      return {
        level: 'Good',
        color: 'bg-green-500',
        textColor: 'text-green-500',
        bgLight: 'bg-green-500/10',
        emoji: '✨',
        description: 'Water quality is good. Safe for consumption and daily use.',
        status: 'good'
      }
    } else if (doLevel >= 4.0) {
      return {
        level: 'Moderate',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-500',
        bgLight: 'bg-yellow-500/10',
        emoji: '⚠️',
        description: 'Water quality is acceptable. Use with basic filtration.',
        status: 'moderate'
      }
    } else if (doLevel >= 2.0) {
      return {
        level: 'Poor',
        color: 'bg-orange-500',
        textColor: 'text-orange-500',
        bgLight: 'bg-orange-500/10',
        emoji: '🚰',
        description: 'Water quality is poor. Requires thorough treatment.',
        status: 'poor'
      }
    } else {
      return {
        level: 'Very Poor',
        color: 'bg-red-500',
        textColor: 'text-red-500',
        bgLight: 'bg-red-500/10',
        emoji: '🚫',
        description: 'Water quality is very poor. Not recommended for use.',
        status: 'very_poor'
      }
    }
  }

  // Get recommendations based on water quality
  const getRecommendations = (status, avgDO) => {
    const recommendations = {
      excellent: {
        actions: [
          "Safe for drinking after basic filtration",
          "Excellent for all household uses",
          "Good for aquatic life",
          "Minimal treatment required"
        ],
        tips: [
          "Continue monitoring regularly",
          "Report any sudden changes",
          "Use water efficiently"
        ],
        alerts: []
      },
      good: {
        actions: [
          "Safe for drinking with standard filtration",
          "Suitable for cooking and bathing",
          "Good for gardening and cleaning",
          "Regular monitoring recommended"
        ],
        tips: [
          "Use a water purifier for drinking",
          "Boil water for sensitive individuals",
          "Check filtration systems regularly"
        ],
        alerts: []
      },
      moderate: {
        actions: [
          "Use RO/UV water purifier for drinking",
          "Boil water before consumption",
          "Safe for bathing and cleaning",
          "Not ideal for aquatic life"
        ],
        tips: [
          "Install a good water filtration system",
          "Avoid drinking without purification",
          "Monitor for changes in color/odor"
        ],
        alerts: [
          "⚠️ Water quality is moderate - use filtration for drinking"
        ]
      },
      poor: {
        actions: [
          "Use bottled water for drinking",
          "Thorough purification required",
          "Limit contact with skin",
          "Not suitable for cooking"
        ],
        tips: [
          "Report water quality issues to authorities",
          "Use water from alternative clean sources",
          "Avoid prolonged exposure"
        ],
        alerts: [
          "⚠️ Poor water quality detected - avoid direct consumption",
          `DO level at ${avgDO.toFixed(2)} mg/L is below safe standards`
        ]
      },
      very_poor: {
        actions: [
          "Do NOT use for drinking or cooking",
          "Avoid all contact if possible",
          "Use only for cleaning with caution",
          "Report to water authorities immediately"
        ],
        tips: [
          "Use bottled water exclusively",
          "Seek alternative water sources",
          "Contact local water department"
        ],
        alerts: [
          "🚨 Critical: Very poor water quality detected",
          `Dissolved Oxygen at dangerously low level: ${avgDO.toFixed(2)} mg/L`,
          "Avoid all consumption - health risk"
        ]
      }
    }
    return recommendations[status] || recommendations.moderate
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading water quality data...</div>
      </div>
    )
  }

  // Prepare monthly data for charts
  const monthlyData = [
    { month: 'Jan', do: waterData['17-Jan'], shortMonth: 'Jan' },
    { month: 'Feb', do: waterData['17-Feb'], shortMonth: 'Feb' },
    { month: 'Mar', do: waterData['16-Mar'], shortMonth: 'Mar' },
    { month: 'Apr', do: waterData['16-Apr'], shortMonth: 'Apr' },
    { month: 'May', do: waterData['16-May'], shortMonth: 'May' },
    { month: 'Jun', do: waterData['16-Jun'], shortMonth: 'Jun' },
    { month: 'Jul', do: waterData['16-Jul'], shortMonth: 'Jul' },
    { month: 'Aug', do: waterData['16-Aug'], shortMonth: 'Aug' },
    { month: 'Sep', do: waterData['16-Sep'], shortMonth: 'Sep' },
    { month: 'Oct', do: waterData['16-Oct'], shortMonth: 'Oct' },
    { month: 'Nov', do: waterData['16-Nov'], shortMonth: 'Nov' },
    { month: 'Dec', do: waterData['16-Dec'], shortMonth: 'Dec' }
  ]

  const avgDO = waterData['Average (mg/L)']
  const qualityConfig = getWaterQualityConfig(avgDO)
  const recommendations = getRecommendations(qualityConfig.status, avgDO)

  // Calculate trend
  const firstHalfAvg =
  monthlyData.slice(0, 6)
    .filter(m => m.do)
    .reduce((sum, m) => sum + m.do, 0) / 6
  const secondHalfAvg = monthlyData.slice(6, 12).reduce((sum, m) => sum + m.do, 0) / 6
  const trend = secondHalfAvg > firstHalfAvg ? 'improving' : secondHalfAvg < firstHalfAvg ? 'declining' : 'stable'

  // Find highest and lowest months
  const sortedMonths = [...monthlyData].sort((a, b) => b.do - a.do)
  const bestMonth = sortedMonths[0]
  const worstMonth = sortedMonths[sortedMonths.length - 1]

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
  <Droplets className="mr-3 text-blue-400" size={36} />
  Water Quality Index
</h1>
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center">
                <MapPin size={18} className="mr-1" />
                <span>{waterData.City}</span>
              </div>
              <div className="flex items-center">
                <Droplets size={18} className="mr-1" />
                <span>{waterData.Locations}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Water Quality Card */}
        <div className={`${qualityConfig.bgLight} border-2 ${qualityConfig.color.replace('bg-', 'border-')} rounded-2xl p-8 mb-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-8xl">{qualityConfig.emoji}</div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Dissolved Oxygen (DO)</div>
                <div className="text-6xl font-bold mb-2">{avgDO.toFixed(2)}</div>
                <div className="text-xl text-gray-400">mg/L</div>
                <div className={`text-2xl font-semibold ${qualityConfig.textColor} mt-2`}>
                  {qualityConfig.level}
                </div>
                <div className="text-gray-300 mt-2">{qualityConfig.description}</div>
              </div>
            </div>
            <div className={`${qualityConfig.color} rounded-full w-32 h-32 flex items-center justify-center`}>
              <Droplets size={64} className="text-white" />
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {recommendations.alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <AlertTriangle className="mr-2 text-red-500" size={28} />
              Water Quality Alerts
            </h2>
            <div className="space-y-3">
              {recommendations.alerts.map((alert, index) => (
                <div 
                  key={index}
                  className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 flex items-start"
                >
                  <AlertCircle className="text-red-500 mr-3 mt-1 flex-shrink-0" size={24} />
                  <p className="text-lg">{alert}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trend Indicator */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Yearly Trend</h3>
              <p className="text-gray-400">
                Comparing first half vs second half of the year
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {trend === 'improving' ? (
                <>
                  <TrendingUp className="text-green-500" size={32} />
                  <span className="text-2xl font-bold text-green-500">Improving</span>
                </>
              ) : trend === 'declining' ? (
                <>
                  <TrendingDown className="text-red-500" size={32} />
                  <span className="text-2xl font-bold text-red-500">Declining</span>
                </>
              ) : (
                <>
                  <Minus className="text-yellow-500" size={32} />
                  <span className="text-2xl font-bold text-yellow-500">Stable</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Average DO */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">Average DO</span>
              <Droplets className="text-blue-400" size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">{avgDO.toFixed(2)} mg/L</div>
            <div className="text-sm text-gray-500">Yearly average</div>
          </div>

          {/* Best Month */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">Best Month</span>
              <ThumbsUp className="text-green-400" size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">{bestMonth.shortMonth}</div>
            <div className="text-sm text-gray-500">{bestMonth.do.toFixed(2)} mg/L</div>
          </div>

          {/* Worst Month */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">Needs Attention</span>
              <AlertCircle className="text-orange-400" size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">{worstMonth.shortMonth}</div>
            <div className="text-sm text-gray-500">{worstMonth.do.toFixed(2)} mg/L</div>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Calendar className="mr-2" size={28} />
            Monthly Dissolved Oxygen Levels
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorDO" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="shortMonth" 
                stroke="#9ca3af"
                style={{ fontSize: '14px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '14px' }}
                label={{ value: 'DO (mg/L)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => [`${value.toFixed(2)} mg/L`, 'Dissolved Oxygen']}
              />
              <Area 
                type="monotone" 
                dataKey="do" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorDO)" 
              />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Chart Legend */}
          <div className="mt-6 flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span>Good (≥6 mg/L)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span>Moderate (4-6 mg/L)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span>Poor (4 mg/L)</span>
            </div>
          </div>
        </div>

        {/* Comparison Bar Chart */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Month-by-Month Comparison</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="shortMonth" 
                stroke="#9ca3af"
                style={{ fontSize: '14px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '14px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => [`${value.toFixed(2)} mg/L`, 'DO Level']}
              />
              <Bar 
                dataKey="do" 
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Two Column Layout - Actions and Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Recommended Actions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <CheckCircle className="mr-2 text-green-500" size={28} />
              Recommended Actions
            </h2>
            <ul className="space-y-3">
              {recommendations.actions.map((action, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-300">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Water Conservation Tips */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Info className="mr-2 text-blue-500" size={28} />
              Conservation Tips
            </h2>
            <ul className="space-y-3">
              {recommendations.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-3 text-xl">💡</span>
                  <span className="text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What is Dissolved Oxygen */}
        <div className="bg-blue-500/10 border border-blue-500 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <Info className="text-blue-400 mr-3 mt-1 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">About Dissolved Oxygen (DO)</h3>
              <p className="text-gray-300 text-sm mb-3">
                Dissolved Oxygen is the amount of oxygen present in water. It's a critical indicator 
                of water quality and the health of aquatic ecosystems. Higher DO levels indicate 
                better water quality.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-green-500/20 border border-green-500 rounded p-2">
                  <div className="font-semibold text-green-300">Excellent</div>
                  <div className="text-gray-400">≥8.0 mg/L</div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500 rounded p-2">
                  <div className="font-semibold text-blue-300">Good</div>
                  <div className="text-gray-400">6.0-8.0 mg/L</div>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-500 rounded p-2">
                  <div className="font-semibold text-yellow-300">Moderate</div>
                  <div className="text-gray-400">4.0-6.0 mg/L</div>
                </div>
                <div className="bg-red-500/20 border border-red-500 rounded p-2">
                  <div className="font-semibold text-red-300">Poor</div>
                  <div className="text-gray-400">&lt; 4.0 mg/L</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Water Quality Standards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <span className="font-semibold text-white">Measurement Location:</span>
              <p>{waterData.Locations}</p>
            </div>
            <div>
              <span className="font-semibold text-white">City:</span>
              <p>{waterData.City}</p>
            </div>
            <div>
              <span className="font-semibold text-white">Parameter Measured:</span>
              <p>Dissolved Oxygen (DO)</p>
            </div>
            <div>
              <span className="font-semibold text-white">Measurement Period:</span>
              <p>January - December</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Water