import bcrypt from "bcryptjs"
import express from "express"
import jwt from "jsonwebtoken"
import {UserRes} from "~/auth/utils/authTypes"
import {hasChars, isEmail, isPassword} from "~/utils/validators"
import {sendError} from "../express/sendError"
import {getJwtSecret} from "../jwt/getJwtSecret"
import {signAuthToken} from "../jwt/signAuthToken"
import {auth} from "../middleware/auth"
import {Link, User} from "../mongoose/models"
import {sendEmail} from "../nodemailer/sendEmail"

export const userRoute = express.Router()

/* -------------------- Load User -------------------- */

userRoute.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.query.userId)
    if (!user) return sendError({message: "User not found", res, status: 404})
    res.json({email: user.email} satisfies UserRes)
  } catch (error) {
    sendError({error, res})
  }
})

/* -------------------- Refresh Token -------------------- */

userRoute.get("/refresh", auth, async (req, res) => {
  try {
    const jwtSecret = getJwtSecret()
    const user = await User.findById(req.query.userId)
    if (!user) return sendError({message: "User not found", res, status: 404})
    signAuthToken({jwtSecret, res, userId: user.id})
  } catch (error) {
    sendError({error, res})
  }
})

/* -------------------- Log In -------------------- */

userRoute.post("/login", async (req, res) => {
  const {email, password} = req.body
  if (!isEmail(email) || !isPassword(password))
    return sendError({message: "Invalid payload", res, status: 400})
  try {
    const jwtSecret = getJwtSecret()
    const user = await User.findOne({email})
    if (!user) return sendError({message: "User not found", res, status: 404})
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return sendError({message: "Incorrect password", res, status: 401})
    signAuthToken({jwtSecret, res, userId: user.id})
  } catch (error) {
    sendError({error, res})
  }
})

/* -------------------- Create Account -------------------- */

userRoute.post("/register", async (req, res) => {
  const {email, password} = req.body
  if (!isEmail(email) || !isPassword(password))
    return sendError({message: "Invalid payload", res, status: 400})
  try {
    const jwtSecret = getJwtSecret()
    const user = await User.findOne({email})
    if (user)
      return sendError({message: "User already exists", res, status: 400})
    const link = await Link.findOne({email, type: "CREATE_ACCOUNT"})
    if (link && link.date.getTime() > Date.now() - 1000 * 60 * 10)
      return res.status(204).json("Link already sent")
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    jwt.sign(
      {email, password: hashedPassword, type: "CREATE_ACCOUNT"},
      jwtSecret,
      {expiresIn: "10m"},
      async (error, token) => {
        if (!token) throw error ?? "Token generation failed"
        await sendEmail({
          html: `
            <h1>Activate Account</h1>
            <p>Welcome to AuthApp! Please activate your account by clicking the link below:</p>
            <a href=${process.env.BASE_URL}/activate/${token}>Complete Registration</a>
            <p>This link will be valid for ten minutes.</p>
          `,
          subject: "[Action Required] Activate Account",
          to: email,
        })
        await new Link({email, type: "CREATE_ACCOUNT"}).save()
        res.json("Link email sent")
      },
    )
  } catch (error) {
    sendError({error, res})
  }
})

userRoute.post("/activate", async (req, res) => {
  const {token} = req.body
  if (!hasChars(token))
    return sendError({message: "Invalid payload", res, status: 400})
  try {
    const jwtSecret = getJwtSecret()
    const value = jwt.verify(token, jwtSecret)
    if (
      typeof value === "string" ||
      value.type !== "CREATE_ACCOUNT" ||
      !isEmail(value.email) ||
      !hasChars(value.password)
    )
      return sendError({message: "Invalid token", res, status: 401})
    const {email, password} = value
    const existingUser = await User.findOne({email})
    if (existingUser)
      return sendError({message: "User already exists", res, status: 400})
    const newUser = new User({email, password})
    await newUser.save()
    await Link.deleteMany({email, type: "CREATE_ACCOUNT"})
    signAuthToken({jwtSecret, res, userId: newUser.id})
  } catch (error) {
    sendError({error, res})
  }
})

/* -------------------- Update Password -------------------- */

userRoute.post("/forgot-password", async (req, res) => {
  const {email} = req.body
  if (!isEmail(email))
    return sendError({message: "Invalid email", res, status: 400})
  try {
    const jwtSecret = getJwtSecret()
    const user = await User.findOne({email})
    if (!user) return sendError({message: "User not found", res, status: 404})
    const link = await Link.findOne({email, type: "UPDATE_PASSWORD"})
    if (link && link.date.getTime() > Date.now() - 1000 * 60 * 10)
      return res.status(204).json("Link already sent")
    jwt.sign(
      {email, type: "UPDATE_PASSWORD"},
      jwtSecret,
      {expiresIn: "10m"},
      async (error, token) => {
        if (!token) throw error ?? "Token generation failed"
        await sendEmail({
          html: `
            <h1>Update Password</h1>
            <p>Please click the link below to create a new AuthApp password:</p>
            <a href=${process.env.BASE_URL}/update-password/${token}>Enter New Password</a>
            <p>This link will be valid for ten minutes.</p>
          `,
          subject: "[Action Required] Update Password",
          to: email,
        })
        await new Link({email, type: "UPDATE_PASSWORD"}).save()
        res.json("Password update email sent")
      },
    )
  } catch (error) {
    sendError({error, res})
  }
})

userRoute.patch("/update-password", async (req, res) => {
  const {password, token} = req.body
  if (!isPassword(password) || !hasChars(token))
    return sendError({message: "Invalid payload", res, status: 400})
  try {
    const jwtSecret = getJwtSecret()
    const value = jwt.verify(token, jwtSecret)
    if (
      typeof value === "string" ||
      value.type !== "UPDATE_PASSWORD" ||
      !isEmail(value.email)
    )
      return sendError({message: "Invalid token", res, status: 401})
    const {email} = value
    const link = await Link.findOne({email, type: "UPDATE_PASSWORD"})
    if (!link)
      return sendError({message: "Link already redeemed", res, status: 401})
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await User.findOneAndUpdate(
      {email},
      {$set: {password: hashedPassword}},
      {new: true},
    )
    if (!user) return sendError({message: "User not found", res, status: 404})
    await Link.deleteMany({email, type: "UPDATE_PASSWORD"})
    signAuthToken({jwtSecret, res, userId: user.id})
  } catch (error) {
    sendError({error, res})
  }
})
