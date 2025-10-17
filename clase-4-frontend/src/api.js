export const API_URL = import.meta.env.VITE_API_URL

// 🧭 Helper para peticiones autenticadas
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token")
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: token })
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error en la petición")
  console.log(data)
  return data
}
