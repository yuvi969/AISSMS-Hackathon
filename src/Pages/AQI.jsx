import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAQI } from "../api.js"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertTriangle, Activity, ArrowLeft, AlertCircle, CheckCircle, XCircle, RefreshCw, MapPin } from 'lucide-react'
import Navbar from "../Components/Navbar.jsx"

const getAQIConfig = (aqi) => {
  const configs = {
    1: { label: 'Good',      hex: '#22c55e', emoji: '😊' },
    2: { label: 'Fair',      hex: '#3b82f6', emoji: '🙂' },
    3: { label: 'Moderate',  hex: '#eab308', emoji: '😐' },
    4: { label: 'Poor',      hex: '#f97316', emoji: '😷' },
    5: { label: 'Very Poor', hex: '#ef4444', emoji: '🚫' },
  }
  return configs[aqi] || configs[4]
}

const AQI = () => {
  const navigate = useNavigate()
  const [aqiData, setAqiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchAQIData() }, [])

  const fetchAQIData = async () => {
    setLoading(true); setError(null)
    try {
      const response = await getAQI(19.076, 72.877)
      if (response.data.success) setAqiData(response.data)
      else setError('Failed to fetch data')
    } catch (err) {
      setError('Cannot connect to backend. Make sure Flask server is running on localhost:5000')
    } finally { setLoading(false) }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a130a' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-t-[#08a728] border-white/10 animate-spin mx-auto mb-4" />
        <p className="text-white/50 text-sm">Loading AQI data...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0a130a' }}>
      <div className="max-w-md w-full text-center p-8 rounded-2xl border border-red-500/20" style={{ background: 'rgba(239,68,68,0.05)' }}>
        <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
        <h2 className="text-white text-xl font-bold mb-2">Connection Error</h2>
        <p className="text-white/40 text-sm mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={fetchAQIData} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#08a728' }}>
            <RefreshCw size={14} /> Retry
          </button>
          <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/60 border border-white/10">
            Back
          </button>
        </div>
      </div>
    </div>
  )

  if (!aqiData?.data) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a130a' }}>
      <p className="text-white/40">No data available</p>
    </div>
  )

  const config = getAQIConfig(aqiData.data.aqi)
  const { data, recommendations } = aqiData

  const pollutants = [
    { name: 'PM2.5', value: data.pm2_5 },
    { name: 'PM10',  value: data.pm10  },
    { name: 'O3',    value: data.o3    },
    { name: 'NO2',   value: data.no2   },
    { name: 'SO2',   value: data.so2   },
    { name: 'CO',    value: data.co    },
  ]

  const card = "rounded-2xl border border-white/7 p-6"
  const cardBg = { background: 'rgba(255,255,255,0.03)' }

  return (
    <>
    <Navbar />
    <div className="min-h-screen pb-16 text-white" style={{ background: '#0a130a' }}>
      <div className="max-w-5xl mx-auto px-6 pt-28">

        {/* Back + Refresh */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition">
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={fetchAQIData} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white/50 border border-white/10 hover:border-white/20 transition">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {/* Title */}
        <div className="mb-8">
          <p className="text-xs font-mono text-white/25 tracking-[3px] uppercase mb-2">◈ Air Quality</p>
          <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Air Quality Index
          </h1>
          <div className="flex items-center gap-1.5 mt-2 text-sm text-white/30">
            <MapPin size={13} />
            {data.lat.toFixed(3)}°, {data.lon.toFixed(3)}°
          </div>
        </div>

        {/* Main AQI Card */}
        <div className={`${card} mb-5 flex items-center justify-between`} style={{ ...cardBg, borderColor: `${config.hex}30`, boxShadow: `0 0 40px ${config.hex}15` }}>
          <div className="flex items-center gap-8">
            <div className="text-6xl">{config.emoji}</div>
            <div>
              <div className="text-6xl font-extrabold" style={{ color: config.hex }}>{data.aqi}</div>
              <div className="text-xl font-semibold text-white mt-1">{config.label}</div>
            </div>
          </div>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: `${config.hex}20`, color: config.hex }}>
            <Activity size={36} />
          </div>
        </div>

        {/* Alerts */}
        {recommendations.alerts.length > 0 && (
          <div className="mb-5 space-y-3">
            {recommendations.alerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20" style={{ background: 'rgba(239,68,68,0.06)' }}>
                <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-300">{alert}</p>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className={`${card} mb-5`} style={cardBg}>
          <p className="text-xs font-mono text-white/25 tracking-widest uppercase mb-3">Summary</p>
          <p className="text-white/70 text-sm leading-relaxed">{recommendations.summary}</p>
        </div>

        {/* Do / Avoid */}
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <div className={card} style={cardBg}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={16} className="text-[#08a728]" />
              <h3 className="text-sm font-semibold text-white">What To Do</h3>
            </div>
            <ul className="space-y-2">
              {recommendations.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="text-[#08a728] mt-0.5">✓</span> {a}
                </li>
              ))}
            </ul>
          </div>
          <div className={card} style={cardBg}>
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={16} className="text-red-400" />
              <h3 className="text-sm font-semibold text-white">What To Avoid</h3>
            </div>
            <ul className="space-y-2">
              {recommendations.avoid.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="text-red-400 mt-0.5">✗</span> {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Groups at Risk */}
        <div className={`${card} mb-5`} style={cardBg}>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-orange-400" />
            <h3 className="text-sm font-semibold text-white">Groups at Risk</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendations.groups_at_risk.map((g, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium text-orange-300 border border-orange-500/20" style={{ background: 'rgba(249,115,22,0.08)' }}>
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className={card} style={cardBg}>
          <h3 className="text-sm font-semibold text-white mb-6">Pollutant Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pollutants}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#161f16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 13 }}
                formatter={(v) => [`${v.toFixed(2)} µg/m³`]}
              />
              <Bar dataKey="value" fill="#08a728" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
    </>
    
  )
}

export default AQI