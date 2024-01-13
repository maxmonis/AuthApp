import nodemailer from "nodemailer"

export function createTransport() {
  const user = process.env.NODEMAILER_EMAIL
  if (!user) throw Error("nodemailer sender email not found")
  const pass = process.env.NODEMAILER_PASSWORD
  if (!pass) throw Error("nodemailer password not found")
  return nodemailer.createTransport({auth: {pass, user}, service: "gmail"})
}
