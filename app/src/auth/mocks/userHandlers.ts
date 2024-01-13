import {rest} from "msw"
import {mockDelay} from "src/msw/mockDelay"
import {TokenRes, UserRes} from "../utils/authTypes"
import {
  mockEmail,
  mockPassword,
  mockRefreshedToken,
  mockToken,
} from "./authMocks"

export const userHandlers = [
  /* -------------------- Load User -------------------- */
  rest.get("api/user", (req, res, ctx) => {
    if (!req.headers.has("X-Auth-Token"))
      return res(ctx.status(401), ctx.json("No token"), ctx.delay(mockDelay()))
    if (
      ![mockToken, mockRefreshedToken].includes(
        req.headers.get("X-Auth-Token") ?? "",
      )
    )
      return res(
        ctx.status(401),
        ctx.json("Invalid token"),
        ctx.delay(mockDelay()),
      )
    return res(
      ctx.json({email: mockEmail} satisfies UserRes),
      ctx.delay(mockDelay()),
    )
  }),

  /* -------------------- Refresh Token -------------------- */
  rest.get("api/user/refresh", (req, res, ctx) => {
    if (!req.headers.has("X-Auth-Token"))
      return res(ctx.status(401), ctx.json("No token"), ctx.delay(mockDelay()))
    if (
      ![mockToken, mockRefreshedToken].includes(
        req.headers.get("X-Auth-Token") ?? "",
      )
    )
      return res(
        ctx.status(401),
        ctx.json("Invalid token"),
        ctx.delay(mockDelay()),
      )
    return res(
      ctx.json({token: mockRefreshedToken} satisfies TokenRes),
      ctx.delay(mockDelay()),
    )
  }),

  /* -------------------- Log In -------------------- */
  rest.post("api/user/login", async (req, res, ctx) => {
    const {email, password} = await req.json()
    if (email !== mockEmail)
      return res(
        ctx.status(404),
        ctx.json("User not found"),
        ctx.delay(mockDelay()),
      )
    if (password !== mockPassword)
      return res(
        ctx.status(401),
        ctx.json("Incorrect password"),
        ctx.delay(mockDelay()),
      )
    return res(
      ctx.json({token: mockToken} satisfies TokenRes),
      ctx.delay(mockDelay()),
    )
  }),

  /* -------------------- Create Account -------------------- */
  rest.post("api/user/create", async (req, res, ctx) => {
    const {email} = await req.json()
    if (email === mockEmail)
      return res(
        ctx.status(400),
        ctx.json("User already exists"),
        ctx.delay(mockDelay()),
      )
    return res(ctx.json("Link email sent"), ctx.delay(mockDelay()))
  }),
  rest.post("api/user/activate", async (req, res, ctx) => {
    const {token} = await req.json()
    if (token !== mockToken)
      return res(
        ctx.status(401),
        ctx.json("Invalid token"),
        ctx.delay(mockDelay()),
      )
    return res(
      ctx.json({token: mockToken} satisfies TokenRes),
      ctx.delay(mockDelay()),
    )
  }),

  /* -------------------- Update Password -------------------- */
  rest.post("api/user/update-password", async (req, res, ctx) => {
    const {email} = await req.json()
    if (email !== mockEmail)
      return res(
        ctx.status(404),
        ctx.json("User not found"),
        ctx.delay(mockDelay()),
      )
    return res(ctx.json("Password update email sent"), ctx.delay(mockDelay()))
  }),
  rest.patch("api/user/update-password", async (req, res, ctx) => {
    const {token} = await req.json()
    if (token !== mockToken)
      return res(
        ctx.status(401),
        ctx.json("Invalid token"),
        ctx.delay(mockDelay()),
      )
    return res(
      ctx.json({token: mockToken} satisfies TokenRes),
      ctx.delay(mockDelay()),
    )
  }),
]
