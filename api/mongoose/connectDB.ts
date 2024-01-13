import mongoose from "mongoose"

export async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI
    if (!mongoURI) throw Error("mongoURI not found")
    mongoose.set("strictQuery", false)
    await mongoose.connect(mongoURI)
    console.log("[server] MongoDB connected")
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
