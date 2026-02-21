import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Dashboard from "./Pages/Dashboard";
import KnowYourEnv from "./Pages/KnowYourEnv";
import LeaderBoard from "./Pages/LeaderBoard";
import Profile from "./Pages/Profile";
import AQI from "./Pages/AQI";
import Water from "./Pages/Water";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leaderboard" element={<LeaderBoard />} />
      <Route path="/knowyourenv" element={<KnowYourEnv />} />    
      <Route path="/profile" element={<Profile />} /> 
      <Route path="/aqi" element={<AQI />} />
      <Route path="/water" element={<Water />} />
    </Routes>
  )
}

export default App
