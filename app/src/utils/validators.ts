export function hasChars(string: unknown, length = 1): string is string {
  return typeof string === "string" && string.trim().length >= length
}

export function isAlphanumeric(string: unknown): string is string {
  return typeof string === "string" && /^[A-Za-z\d]+$/.test(string)
}

export function isEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)
  )
}

export function isPassword(password: unknown): password is string {
  return (
    typeof password === "string" &&
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)
  )
}
