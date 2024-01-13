import dotenv from "dotenv"
import express from "express"
import path from "path"
import {connectDB} from "./mongoose/connectDB"
import {userRoute} from "./routes/userRoute"

const server = express()

dotenv.config()

connectDB()

server.use(express.json())

server.use("/api/user", userRoute)

if (process.env.NODE_ENV === "production") {
  server.use(express.static("app/build"))
  server.get("*", (_req, res) =>
    res.sendFile(path.resolve(__dirname, "app", "build", "index.html")),
  )
}

const port = process.env.PORT ?? 5000

server.listen(port, () => console.log(`[server] Started on port ${port}`))
