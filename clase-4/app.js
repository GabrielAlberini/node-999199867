import express from 'express'
import cors from "cors"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const server = express()
server.use(cors())
server.use(express.json())

// status
server.get("/", (request, response) => {
  response.json({ status: false })
})

const connectDb = async () => {
  await mongoose.connect("mongodb://localhost:27017/curso-node")
  console.log("✅ Conectado a MongoDB con éxito")
}

// Creación de esquema de Mongodb
// los datos que voy agregar estarán basados en estas validaciones
const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, default: 0 },
  stock: { type: Number, required: true },
  descripcion: { type: String },
  categoria: { type: String, required: true }
}, {
  versionKey: false
})

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  versionKey: false
})

// modelo un un objeto que nos da acceso a los métodos de mongodb
// findByIdAndUpdate() 
const Product = mongoose.model("Product", productSchema)
const User = mongoose.model("User", userSchema)

const authMiddleware = (request, response, next) => {
  // ✅ validar el token -> validar la sesión
  const token = request.headers.authorization

  if (!token) {
    response.json({ status: "Se necesita el permiso" })
  }

  const decoded = jwt.verify(token, "CLAVE_SECRETA")
  next()
}

// agregar un usuario en la db
server.post("/auth/register", async (request, response) => {
  const body = request.body

  const user = await User.findOne({ email: body.email })

  if (user) {
    return response.status(400).json({ message: "El usuario ya existe en nuestras base de datos" })
  }

  const hash = await bcrypt.hash(body.password, 10)

  const newUser = new User({
    email: body.email,
    password: hash
  })

  await newUser.save()

  response.json(newUser)
})

// creación de sesión -> una sesión me permite ingresar a los datos por cierto tiempo
server.post("/auth/login", async (request, response) => {
  const body = request.body

  const user = await User.findOne({ email: body.email })

  if (!user) {
    return response.status(401).json({ status: "Usuario no encontrado, credenciales invalidas" })
  }

  const passwordValidada = await bcrypt.compare(body.password, user.password)
  if (!passwordValidada) {
    return response.status(401).json({ status: "Usuario no encontrado, credenciales invalidas" })
  }

  const token = jwt.sign({ id: user.id, email: user.email }, "CLAVE_SECRETA", { expiresIn: "1h" })

  response.json({ token })
})

// get product
server.get("/products", authMiddleware, async (request, response) => {
  const products = await Product.find()
  response.json(products)
})

// add product
server.post("/products", authMiddleware, async (request, response) => {
  const body = request.body

  const { nombre, precio, stock, descripcion, categoria } = body

  if (!nombre || !precio || !stock || !descripcion || !categoria) {
    return response.status(400).json({ status: "Data invalida, intentalo nuevamente" })
  }

  const newProduct = new Product({
    nombre,
    precio,
    stock,
    descripcion,
    categoria
  })

  await newProduct.save()
  response.json(newProduct)
})

server.patch("/products/:id", authMiddleware, async (request, response) => {
  const body = request.body
  const id = request.params.id

  const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true })

  if (!updatedProduct) {
    return response.status(404).json({ error: "Producto no encontrado" })
  }

  response.json(updatedProduct)
})

server.delete("/products/:id", authMiddleware, async (request, response) => {
  const id = request.params.id

  const deletedProduct = await Product.findByIdAndDelete(id)

  if (!deletedProduct) {
    return response.status(404).json({ error: "No se encuentra el producto para borrar" })
  }

  response.json(deletedProduct)
})

server.listen(1111, () => {
  connectDb()
  console.log(`Server conectado en http://localhost:1111`)
})