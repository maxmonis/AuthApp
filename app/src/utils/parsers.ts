import axios from "axios"

export function parseError(error: unknown) {
  return axios.isAxiosError(error) && typeof error.response?.data === "string"
    ? {status: error.response.status, message: error.response.data}
    : error instanceof Error
      ? {message: error.message}
      : typeof error === "string"
        ? {message: error}
        : {}
}
