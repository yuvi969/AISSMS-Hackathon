const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export const submitTicket = async (formData) => {
  const response = await fetch(`${BASE_URL}/tickets/submit`, {
    method: "POST",
    body: formData,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to submit ticket")
  }
  return response.json()
}

export const fetchLeaderboard = async () => {
  const response = await fetch(`${BASE_URL}/users/leaderboard`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to fetch leaderboard")
  }
  return response.json() 
}

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Login failed")
  }
  return response.json() 
}

export const registerUser = async (name, email, password) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Registration failed")
  }
  return response.json() 
}