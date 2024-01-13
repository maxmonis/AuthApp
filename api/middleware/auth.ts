import {NextFunction, Request, Response} from "express"
import jwt from "jsonwebtoken"
import {hasChars} from "~/utils/validators"
import {sendError} from "../express/sendError"
import {getJwtSecret} from "../jwt/getJwtSecret"

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const jwtSecret = getJwtSecret()
    const token = req.header("X-Auth-Token")
    if (!hasChars(token))
      return sendError({message: "No token", res, status: 401})
    const value = jwt.verify(token, jwtSecret)
    if (
      typeof value === "string" ||
      value.type !== "USER_AUTH" ||
      !hasChars(value.userId)
    )
      return sendError({message: "Invalid token", res, status: 401})
    req.query.userId = value.userId
    next()
  } catch (error) {
    sendError({error, res})
  }
}
