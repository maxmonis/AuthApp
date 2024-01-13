import mongoose from "mongoose"

export const Link = mongoose.model(
  "link",
  new mongoose.Schema({
    date: {default: Date.now, type: Date},
    email: {required: true, type: String},
    type: {required: true, type: String},
  }),
)

export const User = mongoose.model(
  "user",
  new mongoose.Schema({
    date: {default: Date.now, type: Date},
    email: {required: true, type: String, unique: true},
    password: {required: true, type: String},
  }),
)
