import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../api"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (res.ok) {
      setMessage("Registro exitoso")
      setTimeout(() => navigate("/"), 1500)
    } else {
      setMessage(data.message)
    }
  }

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Registrarme</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
