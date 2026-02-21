import { Routes, Route } from "react-router-dom"
import Homepage from "./Pages/Homepage"
import Dashboard from "./Pages/Dashboard"
import KnowYourEnv from "./Pages/KnowYourEnv"
import LeaderBoard from "./Pages/LeaderBoard"
import Form from "./Pages/Form"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"

const App = () => {
  return (
    <Routes>
      <Route path="/"            element={<Homepage />} />
      <Route path="/dashboard"   element={<Dashboard />} />
      <Route path="/leaderboard" element={<LeaderBoard />} />
      <Route path="/knowyourenv" element={<KnowYourEnv />} />
      <Route path="/form"        element={<Form />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/signup"      element={<Signup />} />
    </Routes>
  )
}

export default App