import {Response} from "express"
import jwt from "jsonwebtoken"
import {TokenRes} from "~/auth/utils/authTypes"

export function signAuthToken({
  jwtSecret,
  res,
  userId,
}: {
  jwtSecret: string
  res: Response
  userId: string
}) {
  jwt.sign(
    {type: "USER_AUTH", userId},
    jwtSecret,
    {expiresIn: "14d"},
    (error, token) => {
      if (token) res.json({token} satisfies TokenRes)
      else throw error ?? "Token generation failed"
    },
  )
}
