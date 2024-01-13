import "@testing-library/jest-dom"
import {server} from "./msw/server"

/* there are a ton of erroneous warnings about state updates
not being wrapped into act, so I'm hiding them for now */
let mockConsoleError: jest.SpyInstance
beforeAll(() => {
  server.listen()
  mockConsoleError = jest
    .spyOn(console, "error")
    .mockImplementation((...args) => {
      const message = typeof args[0] === "string" ? args[0] : ""
      if (
        !message.includes(
          "When testing, code that causes React state updates should be wrapped into act(...)",
        )
      )
        console.error.call(console, args)
    })
})

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
  mockConsoleError.mockRestore()
})
