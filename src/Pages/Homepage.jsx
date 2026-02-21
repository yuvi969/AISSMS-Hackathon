import { useEffect, useRef } from "react"
import Navbar from "../Components/Navbar"
import Leaflet from "../Components/Leaflet"
import EnvIcon from "../Components/Evicon"

const stats = [
  { value: "2.4", label: "Active Users",     icon: "◈", color: "#1C7DF1" },
  { value: "47",  label: "Cities Monitored", icon: "⬡", color: "#17ce3c" },
  { value: "12",  label: "Rewards Earned",   icon: "◆", color: "#ed8a26" },
  { value: "89%",  label: "Data Accuracy",    icon: "▲", color: "#a855f7" },
]

export default function Homepage() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(23,206,60,${p.opacity})`
        ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(23,206,60,${0.08 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 120px 24px 80px;
          overflow: hidden;
          font-family: 'Syne', sans-serif;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(23,206,60,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(28,125,241,0.06) 0%, transparent 60%),
            #050a06;
        }

        .hero-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none;
        }

        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(23,206,60,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(23,206,60,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
          pointer-events: none;
        }

        .hero-content {
          position: relative; z-index: 2;
          text-align: center; max-width: 760px;
        }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px;
          background: rgba(23,206,60,0.1);
          border: 1px solid rgba(23,206,60,0.25);
          border-radius: 100px;
          font-family: 'Space Mono', monospace;
          font-size: 11px; color: #17ce3c;
          letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 28px;
          animation: fadeUp 0.6s ease both;
        }

        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #17ce3c; box-shadow: 0 0 8px #17ce3c;
          animation: glow-pulse 1.5s infinite;
        }

        .hero-title {
          font-size: clamp(42px, 7vw, 80px);
          font-weight: 800; line-height: 1.05; letter-spacing: -2px;
          color: #fff; margin-bottom: 20px;
          animation: fadeUp 0.7s ease 0.1s both;
        }
        .hero-title span {
          background: linear-gradient(135deg, #17ce3c 0%, #0aff5a 50%, #17ce3c 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 30px rgba(23,206,60,0.4));
        }

        .hero-sub {
          font-size: 17px; color: rgba(255,255,255,0.45);
          max-width: 500px; margin: 0 auto 40px; line-height: 1.7;
          animation: fadeUp 0.7s ease 0.2s both;
        }

        .hero-actions {
          display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
          animation: fadeUp 0.7s ease 0.3s both;
        }

        .btn-primary {
          padding: 13px 28px;
          background: linear-gradient(135deg, #17ce3c, #0aad32);
          border: none; border-radius: 14px;
          color: #050a06; font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700; cursor: pointer;
          text-decoration: none; display: inline-block;
          box-shadow: 0 4px 24px rgba(23,206,60,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(23,206,60,0.55); }

        .btn-ghost {
          padding: 13px 28px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; color: rgba(255,255,255,0.7);
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; text-decoration: none; display: inline-block;
          backdrop-filter: blur(12px); transition: all 0.2s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); color: #fff; transform: translateY(-3px); }

        .stats-strip {
          position: relative; z-index: 2;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; max-width: 860px; width: 100%;
          margin: 60px auto 0;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; overflow: hidden;
          animation: fadeUp 0.7s ease 0.4s both;
        }

        .stat-item {
          padding: 24px 20px; background: rgba(5,10,6,0.9);
          text-align: center; transition: background 0.25s;
        }
        .stat-item:hover { background: rgba(23,206,60,0.05); }
        .stat-icon  { font-size: 14px; margin-bottom: 8px; display: block; }
        .stat-value { font-size: 26px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
        .stat-label {
          font-family: 'Space Mono', monospace; font-size: 10px;
          color: rgba(255,255,255,0.35); letter-spacing: 1px; text-transform: uppercase;
        }

        @media (max-width: 640px) {
          .stats-strip { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <Navbar />

      <section className="hero" id="home">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-grid" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Real-time Environmental Intelligence
          </div>

          <h1 className="hero-title">
            Monitor the Planet.<br />
            <span>Earn for Every Action.</span>
          </h1>

          <p className="hero-sub">
            EcoSimple turns environmental data into actionable insights — track air quality,
            earn green rewards, and make sustainability second nature.
          </p>

          <div className="hero-actions">
            <a href="/dashboard" className="btn-primary">🌿 Explore Dashboard</a>
            <a href="/leaderboard" className="btn-ghost">🏆 Leaderboard</a>
          </div>
        </div>
        <EnvIcon/>
        <div className="stats-strip">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <span className="stat-icon" style={{ color: s.color }}>{s.icon}</span>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      {/* <div className=" bg-gradient-to-b from-[#050a06] to-[#f2f6f9]  px-14 py-12 "/> */}
          <Leaflet/>
    </>
  )
}