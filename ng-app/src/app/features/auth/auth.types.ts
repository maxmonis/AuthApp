import {authRoutes} from "./auth.constants"

export type AuthRoute = (typeof authRoutes)[number]

export type TokenRes = {token: string}

export type UserRes = {email: string}
