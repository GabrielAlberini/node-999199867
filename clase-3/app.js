import express from 'express'
import fs from 'node:fs'
import cors from "cors"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

const server = express()
server.use(cors())
server.use(express.json())

// helper/util
const products = JSON.parse(fs.readFileSync("./products.json"))
const users = JSON.parse(fs.readFileSync("./users.json"))
const writeDb = (path, data) => fs.writeFileSync(path, JSON.stringify(data))

// status
server.get("/", (request, response) => {
  response.json({ status: false })
})

const authMiddleware = (request, response, next) => {
  // ✅ validar el token -> validar la sesión
  const token = request.headers.authorization

  if (!token) {
    response.json({ status: "Se necesita el permiso" })
  }

  const decoded = jwt.verify(token, "CLAVE_SECRETA")
  console.log(decoded)
  next()
}

// agregar un usuario en la db
server.post("/auth/register", async (request, response) => {
  const body = request.body

  const usuario = users.find(user => user.email === body.email)

  if (usuario) {
    return response.status(400).json({ message: "El usuario ya existe en nuestras base de datos" })
  }

  const hash = await bcrypt.hash(body.password, 10)

  const nuevoUsusario = {
    id: crypto.randomUUID(),
    email: body.email,
    password: hash
  }

  users.push(nuevoUsusario)
  writeDb("./users.json", users)

  response.json({ status: "agregando usuario" })
})

// creación de sesión -> una sesión me permite ingresar a los datos por cierto tiempo
server.post("/auth/login", async (request, response) => {
  const body = request.body

  const usuario = users.find(user => user.email === body.email)

  if (!usuario) {
    return response.status(401).json({ status: "Usuario no encontrado, credenciales invalidas" })
  }

  const passwordValidada = await bcrypt.compare(body.password, usuario.password)
  if (!passwordValidada) {
    return response.status(401).json({ status: "Usuario no encontrado, credenciales invalidas" })
  }

  // CREAR UNA SESIÓN!!! ✅

  // 1 - payload -> información del usuario logueado
  // 2 - clave secreta
  // 3 - objeto de configuración

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, "CLAVE_SECRETA", { expiresIn: "1h" })

  response.json({ token })
})

// get product
server.get("/products", authMiddleware, (request, response) => {
  response.json(products)
})

// add product
server.post("/products", authMiddleware, (request, response) => {
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
  writeDb("./products.json", products)

  response.json({ data: "agregando producto!" })
})

server.patch("/products/:id", authMiddleware, (request, response) => {
  const body = request.body
  const id = request.params.id

  const index = products.findIndex(product => product.id === id)

  if (index === -1) {
    return response.status(404).json({ status: "No se encuentra el recurso" })
  }

  products[index] = { ...products[index], ...body }
  writeDb("./products.json", products)

  response.json(products[index])
})

server.delete("/products/:id", authMiddleware, (request, response) => {
  const id = request.params.id

  const newProducts = products.filter((product) => product.id !== id)
  writeDb("./products.json", newProducts)

  response.json({ status: "Producto borrado con éxito", id })
})

server.listen(1111, () => {
  console.log(`Server conectado en http://localhost:1111`)
})