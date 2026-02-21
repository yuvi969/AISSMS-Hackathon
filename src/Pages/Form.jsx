import { useState, useRef } from "react"
import { Upload, X, Send } from "lucide-react"
import { submitTicket } from "../api.js"

const TRANSPORT_TYPES = ["Bus", "Train", "Metro"]

export default function Form() {
  const [form, setForm]       = useState({ name: "", email: "", transportType: "" })
  const [image, setImage]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState("")
  const fileRef = useRef()

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith("image/")) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!image) { setError("Please upload a ticket image."); return }

    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => formData.append(k, v))
    formData.append("ticketImage", image)

    try {
      setLoading(true)
      await submitTicket(formData)
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setForm({ name: "", email: "", transportType: "" })
    setImage(null); setPreview(null); setSuccess(false); setError("")
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="text-green-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Ticket Submitted!</h2>
          <p className="text-slate-500 text-sm mb-6">Your ticket has been received successfully.</p>
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        <div className="mb-7">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Public Transport Portal</p>
          <h1 className="text-2xl font-bold text-slate-800">Upload Your Ticket</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name</label>
            <input
              name="name" required value={form.name} onChange={handleChange}
              placeholder="Name "
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email</label>
            <input
              type="email" name="email" required value={form.email} onChange={handleChange}
              placeholder="anyabankar@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Transport Type</label>
            <select
              name="transportType" required value={form.transportType} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition"
            >
              <option value="">Select type</option>
              {TRANSPORT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Ticket Image <span className="text-red-400">*</span>
            </label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <img src={preview} alt="Ticket" className="w-full max-h-56 object-contain bg-slate-50" />
                <button
                  type="button"
                  onClick={() => { setImage(null); setPreview(null) }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 truncate">
                  {image?.name}
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer w-full py-10 rounded-xl border-2 border-dashed border-slate-200
                           hover:border-slate-400 bg-slate-50 hover:bg-slate-100
                           flex flex-col items-center gap-2 text-slate-400 hover:text-slate-600 transition-all"
              >
                <Upload size={22} />
                <p className="text-sm font-semibold">Click or drag & drop</p>
                <p className="text-xs text-slate-300">JPG, PNG, WEBP — max 10MB</p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700
                       disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors shadow-md"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Send size={14} />
            }
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>

        </form>
      </div>
    </div>
  )
}