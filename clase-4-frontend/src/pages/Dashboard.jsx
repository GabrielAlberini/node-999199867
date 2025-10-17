import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../api"
import ProductForm from "../components/ProductForm"

export default function Dashboard() {
  const { logout } = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const [productToEdit, setProductToEdit] = useState(null)
  const navigate = useNavigate()

  const fetchProducts = async () => {
    try {
      const res = await apiFetch("/products")
      console.log(res)
      setProducts(res)
    } catch (err) {
      logout()
      navigate("/")
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    await apiFetch(`/products/${id}`, { method: "DELETE" })
    fetchProducts()
  }

  const handleEdit = (product) => {
    setProductToEdit(product)
  }

  const clearEdit = () => setProductToEdit(null)

  return (
    <div className="container">
      <h2>Panel de Productos</h2>
      <button onClick={() => logout()}>Cerrar sesión</button>

      <ProductForm
        onSave={fetchProducts}
        productToEdit={productToEdit}
        clearEdit={clearEdit}
      />

      <ul>
        {products.map(p => (
          <li key={p.id}>
            <div>
              <strong>{p.nombre}</strong> - ${p.precio} ({p.categoria})
            </div>
            <div>
              <button onClick={() => handleEdit(p)} style={{ backgroundColor: "#10b981", marginRight: "8px" }}>
                ✏️ Editar
              </button>
              <button onClick={() => handleDelete(p.id)}>
                🗑️ Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
