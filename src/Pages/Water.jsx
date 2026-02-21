import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Droplets, ArrowLeft, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Minus, MapPin, Info, AlertTriangle, ThumbsUp } from 'lucide-react'
import Navbar from "../Components/Navbar.jsx"
const getWaterConfig = (do_) => {
  if (do_ >= 8.0) return { level: 'Excellent', hex: '#3b82f6', emoji: '💎' }
  if (do_ >= 6.0) return { level: 'Good',      hex: '#22c55e', emoji: '✨' }
  if (do_ >= 4.0) return { level: 'Moderate',  hex: '#eab308', emoji: '⚠️' }
  if (do_ >= 2.0) return { level: 'Poor',      hex: '#f97316', emoji: '🚰' }
  return               { level: 'Very Poor',  hex: '#ef4444', emoji: '🚫' }
}

const mockData = [{
  "16-Apr": 8.5,  "16-Aug": 5.4,  "16-Dec": 5.7,  "16-Jul": 7.0,
  "16-Jun": 11.5, "16-Mar": 5.5,  "16-May": 10.4, "16-Nov": 8.5,
  "16-Oct": 10.75,"16-Sep": 6.25, "17-Feb": 11.25,"17-Jan": 11.2,
  "Average (mg/L)": 8.5, "City": "Pune", "Locations": "1.Khadakwasla"
}]

const Water = () => {
  const navigate = useNavigate()
  const [waterData, setWaterData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch('YOUR_WATER_API_ENDPOINT_HERE')
        const d = await res.json()
        setWaterData(d[0])
      } catch {
        setWaterData(mockData[0])
      } finally { setLoading(false) }
    }
    fetch_()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a130a' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-t-blue-500 border-white/10 animate-spin mx-auto mb-4" />
        <p className="text-white/50 text-sm">Loading water data...</p>
      </div>
    </div>
  )

  const monthlyData = [
    { m: 'Jan', do: waterData['17-Jan']  },
    { m: 'Feb', do: waterData['17-Feb']  },
    { m: 'Mar', do: waterData['16-Mar']  },
    { m: 'Apr', do: waterData['16-Apr']  },
    { m: 'May', do: waterData['16-May']  },
    { m: 'Jun', do: waterData['16-Jun']  },
    { m: 'Jul', do: waterData['16-Jul']  },
    { m: 'Aug', do: waterData['16-Aug']  },
    { m: 'Sep', do: waterData['16-Sep']  },
    { m: 'Oct', do: waterData['16-Oct']  },
    { m: 'Nov', do: waterData['16-Nov']  },
    { m: 'Dec', do: waterData['16-Dec']  },
  ]

  const avgDO = waterData['Average (mg/L)']
  const cfg = getWaterConfig(avgDO)
  const sorted = [...monthlyData].sort((a, b) => b.do - a.do)
  const best = sorted[0], worst = sorted[sorted.length - 1]
  const h1 = monthlyData.slice(0, 6).reduce((s, m) => s + (m.do || 0), 0) / 6
  const h2 = monthlyData.slice(6).reduce((s, m) => s + (m.do || 0), 0) / 6
  const trend = h2 > h1 ? 'improving' : h2 < h1 ? 'declining' : 'stable'

  const card = "rounded-2xl border border-white/7 p-6"
  const cardBg = { background: 'rgba(255,255,255,0.03)' }

  return (
    <>
     <div className="min-h-screen pb-16 text-white" style={{ background: '#0a130a' }}>
      <div className="max-w-5xl mx-auto px-6 pt-28">

        {/* Back */}
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition mb-8">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Title */}
        <div className="mb-8">
          <p className="text-xs font-mono text-white/25 tracking-[3px] uppercase mb-2">◈ Water Quality</p>
          <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Water Quality Index
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-white/30">
            <span className="flex items-center gap-1.5"><MapPin size={13} />{waterData.City}</span>
            <span className="flex items-center gap-1.5"><Droplets size={13} />{waterData.Locations}</span>
          </div>
        </div>

        {/* Main Card */}
        <div className={`${card} mb-5 flex items-center justify-between`} style={{ ...cardBg, borderColor: `${cfg.hex}30`, boxShadow: `0 0 40px ${cfg.hex}15` }}>
          <div className="flex items-center gap-8">
            <div className="text-6xl">{cfg.emoji}</div>
            <div>
              <p className="text-xs text-white/30 mb-1">Dissolved Oxygen</p>
              <div className="text-6xl font-extrabold" style={{ color: cfg.hex }}>{avgDO.toFixed(2)}</div>
              <div className="text-sm text-white/40 mt-1">mg/L · <span className="font-semibold" style={{ color: cfg.hex }}>{cfg.level}</span></div>
            </div>
          </div>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: `${cfg.hex}20`, color: cfg.hex }}>
            <Droplets size={36} />
          </div>
        </div>

        {/* Trend + Stats */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className={`${card} col-span-1`} style={cardBg}>
            <p className="text-xs text-white/25 mb-3">Trend</p>
            <div className="flex items-center gap-2">
              {trend === 'improving' ? <TrendingUp size={22} className="text-green-400" /> : trend === 'declining' ? <TrendingDown size={22} className="text-red-400" /> : <Minus size={22} className="text-yellow-400" />}
              <span className="font-bold capitalize text-white">{trend}</span>
            </div>
          </div>
          <div className={card} style={cardBg}>
            <p className="text-xs text-white/25 mb-1">Best Month</p>
            <div className="text-2xl font-bold text-green-400">{best.m}</div>
            <div className="text-xs text-white/30">{best.do?.toFixed(2)} mg/L</div>
          </div>
          <div className={card} style={cardBg}>
            <p className="text-xs text-white/25 mb-1">Needs Attention</p>
            <div className="text-2xl font-bold text-orange-400">{worst.m}</div>
            <div className="text-xs text-white/30">{worst.do?.toFixed(2)} mg/L</div>
          </div>
        </div>

        {/* Area Chart */}
        <div className={`${card} mb-5`} style={cardBg}>
          <h3 className="text-sm font-semibold text-white mb-6">Monthly DO Levels</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="doGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={cfg.hex} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={cfg.hex} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="m" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#0d140e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 13 }}
                formatter={(v) => [`${v?.toFixed(2)} mg/L`, 'DO']}
              />
              <Area type="monotone" dataKey="do" stroke={cfg.hex} strokeWidth={2.5} fill="url(#doGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className={`${card} mb-5`} style={cardBg}>
          <h3 className="text-sm font-semibold text-white mb-6">Month-by-Month</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="m" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#0d140e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 13 }}
                formatter={(v) => [`${v?.toFixed(2)} mg/L`]}
              />
              <Bar dataKey="do" fill={cfg.hex} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DO Scale */}
        <div className={`${card} mb-5`} style={{ ...cardBg, borderColor: 'rgba(59,130,246,0.2)' }}>
          <div className="flex items-start gap-3">
            <Info size={15} className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white mb-3">Dissolved Oxygen Scale</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { l: 'Excellent', r: '≥8.0',     c: '#3b82f6' },
                  { l: 'Good',      r: '6.0–8.0',  c: '#22c55e' },
                  { l: 'Moderate',  r: '4.0–6.0',  c: '#eab308' },
                  { l: 'Poor',      r: '<4.0',      c: '#ef4444' },
                ].map(({ l, r, c }) => (
                  <div key={l} className="p-2 rounded-xl border text-xs" style={{ borderColor: `${c}30`, background: `${c}10` }}>
                    <div className="font-semibold mb-0.5" style={{ color: c }}>{l}</div>
                    <div className="text-white/40">{r} mg/L</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className={card} style={cardBg}>
          <h3 className="text-sm font-semibold text-white mb-4">Station Info</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['City',        waterData.City],
              ['Location',    waterData.Locations],
              ['Parameter',   'Dissolved Oxygen (DO)'],
              ['Period',      'January – December'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-white/25 text-xs mb-0.5">{k}</p>
                <p className="text-white/70">{v}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
    </>
   
  )
}

export default Water