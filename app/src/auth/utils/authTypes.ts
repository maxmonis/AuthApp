import {accountRoutes} from "./authConstants"

export type AccountRoute = (typeof accountRoutes)[number]

export type TokenRes = {token: string}

export type UserRes = {email: string}
