import { useState, useEffect } from "react"
import { apiFetch } from "../api"

export default function ProductForm({ onSave, productToEdit, clearEdit }) {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    categoria: ""
  })

  useEffect(() => {
    if (productToEdit) {
      setForm(productToEdit)
    } else {
      setForm({ nombre: "", precio: "", stock: "", descripcion: "", categoria: "" })
    }
  }, [productToEdit])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (productToEdit) {
      // ✏️ editar producto existente
      await apiFetch(`/products/${productToEdit.id}`, {
        method: "PATCH",
        body: JSON.stringify(form)
      })
      clearEdit()
    } else {
      // ➕ crear producto nuevo
      await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(form)
      })
    }

    setForm({ nombre: "", precio: "", stock: "", descripcion: "", categoria: "" })
    onSave()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
      <input name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} />
      <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
      <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
      <input name="categoria" placeholder="Categoría" value={form.categoria} onChange={handleChange} />
      <button type="submit">
        {productToEdit ? "Guardar Cambios" : "Agregar Producto"}
      </button>
      {productToEdit && (
        <button type="button" onClick={clearEdit} style={{ backgroundColor: "#6b7280" }}>
          Cancelar
        </button>
      )}
    </form>
  )
}
