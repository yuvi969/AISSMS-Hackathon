import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapPin } from "lucide-react"

// Fix broken marker icons in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Pulsing custom dot marker
const createPulseIcon = (color = "#16a34a") =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:14px; height:14px; border-radius:50%;
        background:${color};
        border:2px solid rgba(255,255,255,0.9);
        box-shadow:0 0 0 0 ${color};
        animation:leafletPulse 2s infinite;
      "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })

// Env monitoring hotspots
const hotspots = [
  { id: 1, pos: [28.6139, 77.2090], label: "New Delhi", aqi: 187, temp: 32, type: "critical", color: "#ef4444" },
  { id: 2, pos: [19.0760, 72.8777], label: "Mumbai", aqi: 98, temp: 29, type: "moderate", color: "#f97316" },
  { id: 3, pos: [12.9716, 77.5946], label: "Bengaluru", aqi: 52, temp: 24, type: "good", color: "#16a34a" },
  { id: 4, pos: [22.5726, 88.3639], label: "Kolkata", aqi: 143, temp: 31, type: "unhealthy", color: "#ea580c" },
  { id: 5, pos: [13.0827, 80.2707], label: "Chennai", aqi: 71, temp: 33, type: "moderate", color: "#f97316" },
  { id: 6, pos: [23.0225, 72.5714], label: "Ahmedabad", aqi: 112, temp: 35, type: "unhealthy", color: "#ea580c" },
  { id: 7, pos: [17.3850, 78.4867], label: "Hyderabad", aqi: 63, temp: 27, type: "good", color: "#16a34a" },
  { id: 8, pos: [18.5204, 73.8567], label: "Pune", aqi: 44, temp: 25, type: "good", color: "#16a34a" },
  { id: 9, pos: [24.7101, 46.6821], label: "Riyadh", aqi: 80, temp: 35, type: "critical", color: "#ef4444" },
]

const aqiLabel = (aqi) => {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Moderate"
  if (aqi <= 150) return "Unhealthy for Some"
  if (aqi <= 200) return "Unhealthy"
  return "Hazardous"
}

// Fly to user location
const FlyToLocation = ({ position }) => {
  const map = useMap()
  useEffect(() => {
    if (position) map.flyTo(position, 12, { duration: 2 })
  }, [position])
  return null
}

export default function Leaflet() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [userPos, setUserPos] = useState(null)

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => alert("Location access denied")
    )
  }

  const filtered = hotspots.filter((h) => {
    const matchSearch = h.label.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || h.type === filter
    return matchSearch && matchFilter
  })

  const filterOptions = ["all", "good", "moderate", "unhealthy", "critical"]

  const filterColors = {
    all: "bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-400",
    good: "bg-green-50  text-green-700  border-green-200 hover:border-green-400",
    moderate: "bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-400",
    unhealthy: "bg-red-50    text-red-600    border-red-200   hover:border-red-400",
    critical: "bg-rose-50   text-rose-700   border-rose-200  hover:border-rose-400",
  }

  const filterActiveColors = {
    all: "bg-slate-200  text-slate-800  border-slate-400",
    good: "bg-green-100  text-green-800  border-green-500",
    moderate: "bg-orange-100 text-orange-700 border-orange-500",
    unhealthy: "bg-red-100    text-red-700    border-red-500",
    critical: "bg-rose-100   text-rose-800   border-rose-500",
  }

  return (
    <>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Mono:wght@400;700&display=swap');

        @keyframes leafletPulse {
          0%   { box-shadow: 0 0 0 0 currentColor; }
          70%  { box-shadow: 0 0 0 10px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }

        .map-font { font-family: 'Syne', sans-serif; }
        .mono-font { font-family: 'Space Mono', monospace; }

        /* Leaflet overrides for light theme */
        .leaflet-container {
          height: 100% !important;
          background: #f1f5f9 !important;
        }

        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.97) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          border-radius: 16px !important;
          box-shadow: 0 16px 48px rgba(0,0,0,0.14) !important;
          color: #0f172a !important;
          font-family: 'Syne', sans-serif !important;
          padding: 0 !important;
        }
        .leaflet-popup-content { margin: 0 !important; padding: 16px !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-popup-close-button {
          color: rgba(0,0,0,0.3) !important;
          top: 10px !important; right: 12px !important;
          font-size: 18px !important;
        }
      `}</style>

      <div className="map-font bg-slate-50 px-6 py-10 pb-16">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mono-font text-[10px] text-green-600 tracking-[3px] uppercase mb-2">
            ◈ Live Data
          </div>
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            Air Quality Intelligence
          </h2>
          <p className="text-slate-400 text-sm mt-2 mono-font">Real-time AQI monitoring across major cities</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center max-w-5xl mx-auto mb-4">
          <input
            className="flex-1 min-w-[180px] px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition placeholder:text-slate-400 shadow-sm"
            placeholder="🔍  Search city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl border text-xs font-bold capitalize transition-all shadow-sm
                ${filter === f ? filterActiveColors[f] : filterColors[f]}`}
            >
              {f}
            </button>
          ))}

          <button
            onClick={handleLocate}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-200 transition-all whitespace-nowrap"
          >
            <MapPin size={14} /> Locate Me
          </button>
        </div>

        {/* Map wrapper */}
        <div className="relative max-w-5xl mx-auto h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%" }}
            zoomControl={false}
          >
            {/* Light tile layer */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {/* User location */}
            {userPos && (
              <>
                <FlyToLocation position={userPos} />
                <Marker position={userPos} icon={createPulseIcon("#3b82f6")}>
                  <Popup>
                    <div className="text-slate-800">
                      <strong className="text-sm">📍 You are here</strong>
                      <div className="text-xs text-slate-400 mt-1">
                        {userPos[0].toFixed(4)}, {userPos[1].toFixed(4)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
                <Circle
                  center={userPos} radius={4000}
                  pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.08, weight: 1 }}
                />
              </>
            )}

            {/* City hotspots */}
            {filtered.map((spot) => (
              <Marker key={spot.id} position={spot.pos} icon={createPulseIcon(spot.color)}>
                <Popup>
                  <div style={{ minWidth: 160, color: "#0f172a" }}>
                    <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>{spot.label}</div>

                    {/* AQI row */}
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 12px",
                      background: `${spot.color}15`,
                      border: `1px solid ${spot.color}40`,
                      borderRadius: 10, marginBottom: 8
                    }}>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>AQI Index</span>
                      <span style={{ fontWeight: 800, fontSize: 22, color: spot.color }}>{spot.aqi}</span>
                    </div>

                    {/* Temp + Status */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{
                        flex: 1, padding: "8px", textAlign: "center",
                        background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0"
                      }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>TEMP</div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{spot.temp}°C</div>
                      </div>
                      <div style={{
                        flex: 1, padding: "8px", textAlign: "center",
                        background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0"
                      }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>STATUS</div>
                        <div style={{ fontWeight: 700, fontSize: 11, color: spot.color }}>{aqiLabel(spot.aqi)}</div>
                      </div>
                    </div>
                  </div>
                </Popup>

                <Circle
                  center={spot.pos} radius={80000}
                  pathOptions={{ color: spot.color, fillColor: spot.color, fillOpacity: 0.05, weight: 0.5 }}
                />
              </Marker>
            ))}
          </MapContainer>

          {/* AQI Legend overlay */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-3 min-w-[190px] shadow-lg">
            <div className="mono-font text-[9px] text-slate-400 tracking-[2px] uppercase mb-2">
              AQI Legend
            </div>
            {[
              { color: "#16a34a", label: "Good (0 – 50)" },
              { color: "#f97316", label: "Moderate (51 – 100)" },
              { color: "#ea580c", label: "Unhealthy (101 – 150)" },
              { color: "#ef4444", label: "Critical (150+)" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2 mb-1.5 text-xs text-slate-500">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: l.color, boxShadow: `0 0 5px ${l.color}` }}
                />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar below map */}
        <div className="max-w-5xl mx-auto mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Cities Monitored", value: hotspots.length, color: "text-slate-700" },
            { label: "Critical Zones", value: hotspots.filter(h => h.type === "critical").length, color: "text-red-500" },
            { label: "Unhealthy Zones", value: hotspots.filter(h => h.type === "unhealthy").length, color: "text-orange-500" },
            { label: "Good Air Quality", value: hotspots.filter(h => h.type === "good").length, color: "text-green-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
              <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-400 mono-font mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}