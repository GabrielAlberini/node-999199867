import express from 'express'
import fs from 'node:fs'
import cors from "cors"

const server = express()
server.use(cors())
server.use(express.json())

// helper/util
const products = JSON.parse(fs.readFileSync("./products.json"))
const writeDb = data => fs.writeFileSync("./products.json", JSON.stringify(data))

// status
server.get("/", (request, response) => {
  response.json({ status: false })
})

// get product
server.get("/products", (request, response) => {
  response.json(products)
})

// add product
server.post("/products", (request, response) => {
  const body = request.body

  const { nombre, precio, stock, descripcion, categoria } = body

  if (!nombre || !precio || !stock || !descripcion || !categoria) {
    return response.status(400).json({ status: "Data invalida, intentalo nuevamente" })
  }

  const newProduct = {
    id: crypto.randomUUID(),
    nombre,
    precio,
    stock,
    descripcion,
    categoria
  }

  // validar si ya existe o no
  // si existe el producto 400
  // si no existe, lo agrego

  products.push(newProduct)
  console.log(products)
  writeDb(products)

  response.json({ data: "agregando producto!" })
})

server.patch("/products/:id", (request, response) => {
  const body = request.body
  const id = request.params.id

  const index = products.findIndex(product => product.id === id)

  if (index === -1) {
    return response.status(404).json({ status: "No se encuentra el recurso" })
  }

  products[index] = { ...products[index], ...body }
  writeDb(products)

  response.json(products[index])
})

server.delete("/products/:id", (request, response) => {
  const id = request.params.id

  const newProducts = products.filter((product) => product.id !== id)
  console.log(newProducts)
  writeDb(newProducts)

  response.json({ status: "Producto borrado con éxito", id })
})

server.listen(1111, () => {
  console.log(`Server conectado en http://localhost:1111`)
})