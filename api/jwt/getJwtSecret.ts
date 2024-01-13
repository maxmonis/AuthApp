export function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET
  if (jwtSecret) return jwtSecret
  throw Error("jwtSecret not found")
}
