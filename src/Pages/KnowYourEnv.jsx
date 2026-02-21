import { useNavigate } from "react-router-dom"

const airData = [
  { city: "New Delhi",  aqi: 187, temp: "32°C", humidity: "58%", wind: "12 km/h", status: "Unhealthy",     color: "#ef4444", bg: "bg-red-50",    border: "border-red-200"    },
  { city: "Mumbai",     aqi: 98,  temp: "29°C", humidity: "72%", wind: "18 km/h", status: "Moderate",      color: "#f97316", bg: "bg-orange-50", border: "border-orange-200" },
  { city: "Bengaluru",  aqi: 52,  temp: "24°C", humidity: "61%", wind: "10 km/h", status: "Good",          color: "#16a34a", bg: "bg-green-50",  border: "border-green-200"  },
  { city: "Kolkata",    aqi: 143, temp: "31°C", humidity: "80%", wind: "8 km/h",  status: "Unhealthy",     color: "#ea580c", bg: "bg-orange-50", border: "border-orange-200" },
  { city: "Chennai",    aqi: 71,  temp: "33°C", humidity: "76%", wind: "14 km/h", status: "Moderate",      color: "#f97316", bg: "bg-orange-50", border: "border-orange-200" },
  { city: "Pune",       aqi: 44,  temp: "25°C", humidity: "55%", wind: "11 km/h", status: "Good",          color: "#16a34a", bg: "bg-green-50",  border: "border-green-200"  },
]

const envFacts = [
  { icon: "🌡️", title: "Global Avg Temp Rise", value: "+1.2°C", desc: "Above pre-industrial levels since 1850" },
  { icon: "🌊", title: "Sea Level Rise",        value: "3.6mm", desc: "Average annual rise over the last decade" },
  { icon: "🌲", title: "Forest Loss",           value: "4.7M ha", desc: "Deforested every year globally" },
  { icon: "♻️", title: "Recycling Rate",        value: "32%",   desc: "Global average municipal waste recycled" },
]

const tips = [
  { icon: "🚲", tip: "Cycle or walk for short distances to cut carbon emissions." },
  { icon: "💡", tip: "Switch to LED bulbs — they use 75% less energy than incandescents." },
  { icon: "🛍️", tip: "Bring reusable bags to reduce single-use plastic waste." },
  { icon: "🚿", tip: "Shorter showers save up to 10 gallons of water per minute." },
  { icon: "🌱", tip: "Plant a tree — one tree absorbs ~21 kg of CO₂ per year." },
  { icon: "📱", tip: "Unplug chargers when not in use to avoid phantom power drain." },
]

const aqiBar = (aqi) => {
  const pct = Math.min((aqi / 300) * 100, 100)
  return pct
}

export default function KnowYourEnv() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Mono:wght@400;700&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .mono { font-family: 'Space Mono', monospace; }
      `}</style>

      <div className="syne min-h-screen bg-slate-50">

        {/* Header */}
        <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition text-sm font-semibold"
            >
              ← Back
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_#16a34a]" />
              <span className="mono text-[11px] text-green-600 tracking-[2px] uppercase">Live Data</span>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div
          className="relative overflow-hidden px-6 py-20 text-center"
          style={{
            background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)",
          }}
        >
          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="mono text-[10px] text-green-400 tracking-[3px] uppercase mb-4">◈ Environmental Intelligence</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Know Your<br />
              <span className="text-green-400">Environment</span>
            </h1>
            <p className="text-green-100/70 text-base max-w-xl mx-auto leading-relaxed">
              Real-time air quality, environmental stats, and actionable tips to help you live more sustainably.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 space-y-14">

          {/* Global Facts */}
          <section>
            <div className="mb-6">
              <div className="mono text-[10px] text-green-600 tracking-[2px] uppercase mb-1">Global Overview</div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Key Environmental Metrics</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {envFacts.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <div className="text-2xl font-extrabold text-slate-800 mb-1">{f.value}</div>
                  <div className="text-sm font-bold text-slate-700 mb-1">{f.title}</div>
                  <div className="mono text-[10px] text-slate-400 leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* AQI Table */}
          <section>
            <div className="mb-6">
              <div className="mono text-[10px] text-green-600 tracking-[2px] uppercase mb-1">Air Quality Index</div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">City-wise AQI Monitor</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {airData.map((d) => (
                <div key={d.city} className={`bg-white rounded-2xl border ${d.border} shadow-sm p-5 hover:shadow-md transition-shadow`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-slate-800 text-base">{d.city}</span>
                    <span
                      className="mono text-[11px] font-bold px-2 py-1 rounded-lg"
                      style={{ background: `${d.color}18`, color: d.color }}
                    >
                      {d.status}
                    </span>
                  </div>

                  {/* AQI bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="mono text-[10px] text-slate-400 uppercase tracking-wide">AQI</span>
                      <span className="font-extrabold text-lg" style={{ color: d.color }}>{d.aqi}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${aqiBar(d.aqi)}%`, background: d.color }}
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Temp",     value: d.temp },
                      { label: "Humidity", value: d.humidity },
                      { label: "Wind",     value: d.wind },
                    ].map((s) => (
                      <div key={s.label} className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                        <div className="mono text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">{s.label}</div>
                        <div className="text-sm font-bold text-slate-700">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* AQI Legend */}
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { color: "#16a34a", label: "Good (0–50)" },
                { color: "#f97316", label: "Moderate (51–100)" },
                { color: "#ea580c", label: "Unhealthy (101–150)" },
                { color: "#ef4444", label: "Critical (150+)" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5 mono text-[10px] text-slate-500">
                  <div className="w-2 h-2 rounded-full" style={{ background: l.color, boxShadow: `0 0 4px ${l.color}` }} />
                  {l.label}
                </div>
              ))}
            </div>
          </section>

          {/* Eco Tips */}
          <section>
            <div className="mb-6">
              <div className="mono text-[10px] text-green-600 tracking-[2px] uppercase mb-1">Take Action</div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Eco Tips for Daily Life</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tips.map((t, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4 items-start hover:border-green-200 hover:shadow-md transition-all"
                >
                  <span className="text-2xl flex-shrink-0">{t.icon}</span>
                  <p className="text-sm text-slate-600 leading-relaxed">{t.tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer CTA */}
          <section className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-10 text-center shadow-xl">
            <h3 className="text-2xl font-extrabold text-white mb-2">Ready to make a difference?</h3>
            <p className="text-green-100/80 text-sm mb-6 max-w-md mx-auto">
              Explore the live dashboard, earn green rewards, and track your environmental impact.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-white text-green-700 font-bold rounded-2xl text-sm
                         hover:-translate-y-1 hover:shadow-xl transition-all duration-200 shadow-lg"
            >
              🌿 Go to Dashboard
            </button>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-slate-100">
          <span className="mono text-[10px] text-slate-400 tracking-[2px] uppercase">EcoSimple · Environmental Intelligence Platform</span>
        </div>
      </div>
    </>
  )
}