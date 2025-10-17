import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { API_URL } from "../api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      // http://localhost:1111
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      console.log(data)
      if (!res.ok) throw new Error(data.message || "Error al iniciar sesión")
      login(data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}
