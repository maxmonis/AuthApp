import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {useAuth} from "src/auth/hooks/useAuth"
import {mockEmail} from "src/auth/mocks/authMocks"
import {App} from "src/components/layout/App"

let mockUser: ReturnType<typeof useAuth>["data"] = null
let mockLoading = false
jest.mock("react-query", () => ({
  ...jest.requireActual("react-query"),
  useQuery: () => ({data: mockUser, isLoading: mockLoading}),
}))

describe("App", () => {
  test("allows navigation to all auth routes if logged out", async () => {
    render(<App />)
    screen.getByRole("heading", {name: "Access Account"})
    userEvent.click(screen.getByRole("link", {name: "Forgot Password"}))
    await screen.findByRole("heading", {name: "Reset Password"})
    userEvent.click(screen.getByRole("link", {name: "Register"}))
    await screen.findByRole("heading", {name: "Create Account"})
    userEvent.click(screen.getByRole("link", {name: "Login"}))
    await screen.findByRole("heading", {name: "Access Account"})
    userEvent.click(screen.getByRole("link", {name: "Register"}))
    await screen.findByRole("heading", {name: "Create Account"})
  })
  test("shows welcome message if user logged in", () => {
    mockUser = {email: mockEmail}
    render(<App />)
    screen.getByRole("heading", {name: "Welcome to AuthApp!"})
  })
  test("shows nothing while authenticating", () => {
    mockLoading = true
    render(<App />)
    expect(screen.queryByRole("heading")).toBeNull()
  })
})
