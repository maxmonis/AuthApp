export function mockDelay(devDelay = 250, testDelay = 0) {
  return process.env.NODE_ENV === "test" ? testDelay : devDelay
}
