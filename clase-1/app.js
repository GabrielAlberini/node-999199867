// file system
import fs from "node:fs"
import http from "http"

const readData = () => {
  const data = JSON.parse(fs.readFileSync("./db.json"))
  return data
}

// protocolo HTTP
// definir la ruta -> http://localhost:3000/api/users
// definir el método -> GET

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json")
  response.setHeader("Access-Control-Allow-Origin", "*")

  const url = "/api/users"
  const method = "GET"

  if (request.url === url && request.method === method) {
    const users = readData()
    response.end(JSON.stringify(users))
  } else {
    response.end(JSON.stringify({ error: "Ruta no encontrada" }))
  }
})

// 65000
server.listen(3000, () => {
  console.log("Servidor en escucha por el puerto http://localhost:3000")
})