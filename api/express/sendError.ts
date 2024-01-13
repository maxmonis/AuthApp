import {Response} from "express"

export function sendError({
  error,
  message = error instanceof Error ? error.message : "Server error",
  res,
  status = 500,
}: {res: Response} & (
  | {error: unknown; message?: never; status?: never}
  | {error?: never; message: string; status?: number}
)) {
  console.error(error ?? message)
  res.status(status).json(message)
}
