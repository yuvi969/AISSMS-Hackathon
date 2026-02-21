import { useNavigate } from "react-router-dom"
import Navbar from "../Components/Navbar"

const Dashboard = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Center Container */}
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-6">

        <div className="flex space-x-6">

          {/* AQI Button */}
          <button
            onClick={() => navigate("/aqi")}
            className="px-8 py-4 bg-green-500 hover:bg-green-600 
            rounded-lg text-lg font-medium transition duration-200"
          >
            AQI
          </button>

          {/* Water Button */}
          <button
            onClick={() => navigate("/water")}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 
            rounded-lg text-lg font-medium transition duration-200"
          >
            Water
          </button>

        </div>
      </div>
    </div>
  )
}

export default Dashboard