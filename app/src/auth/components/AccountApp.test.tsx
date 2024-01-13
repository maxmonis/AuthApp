import {screen, waitFor} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {rest} from "msw"
import {AccountRoute} from "src/auth/utils/authTypes"
import {renderWithWrappers} from "src/msw/renderWithWrappers"
import {server} from "src/msw/server"
import {mockEmail, mockPassword, mockToken} from "../mocks/authMocks"
import {AccountApp} from "./AccountApp"

const mockRequest = jest.fn()

const mockNavigate = jest.fn()
let mockParams: undefined | {token: string}
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}))

beforeAll(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.resetAllMocks()
  jest.runOnlyPendingTimers()
})

async function renderAccountApp(route: AccountRoute) {
  const view = renderWithWrappers(<AccountApp {...{route}} />)
  await screen.findByRole("heading", {name: "AuthApp"})
  return view
}

describe("AccountApp", () => {
  /* -------------------- Login -------------------- */
  describe("login", () => {
    test("renders form", async () => {
      const {asFragment} = await renderAccountApp("login")
      screen.getByRole("heading", {name: "Access Account"})
      screen.getByLabelText("Email")
      screen.getByLabelText("Password")
      screen.getByRole("button", {name: "Log In"})
      expect(asFragment()).toMatchSnapshot()
    })
    describe("submission", () => {
      test("navigates to home page on success", async () => {
        await renderAccountApp("login")
        userEvent.type(screen.getByLabelText("Email"), mockEmail)
        userEvent.type(
          screen.getByLabelText("Password"),
          mockPassword + "{enter}",
        )
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith("/", {replace: true})
        })
      })
      test("disabled during submission and while error displayed", async () => {
        server.use(rest.post("/api/user/login", mockRequest))
        await renderAccountApp("login")
        userEvent.type(screen.getByLabelText("Email"), "not@user.email")
        userEvent.type(
          screen.getByLabelText("Password"),
          mockPassword + "{enter}",
        )
        const submitButton = screen.getByRole("button", {name: "Log In"})
        await waitFor(() => {
          expect(submitButton).toBeDisabled()
        })
        expect(mockRequest).toHaveBeenCalledTimes(1)
        userEvent.keyboard("{enter}")
        jest.advanceTimersByTime(3000)
        await waitFor(() => {
          expect(submitButton).not.toBeDisabled()
        })
        expect(mockRequest).toHaveBeenCalledTimes(1)
      })
    })
    describe("validation", () => {
      test("email and password are required", async () => {
        const {asFragment} = await renderAccountApp("login")
        userEvent.click(screen.getByRole("button", {name: "Log In"}))
        await screen.findByText("Email is required")
        screen.getByText("Password is required")
        expect(asFragment()).toMatchSnapshot()
      })
      test("validates email", async () => {
        const {asFragment} = await renderAccountApp("login")
        userEvent.type(screen.getByLabelText("Email"), "notanemail{enter}")
        await screen.findByText("Invalid email")
        expect(asFragment()).toMatchSnapshot()
      })
      test("validates password", async () => {
        const {asFragment} = await renderAccountApp("login")
        const passwordInput = screen.getByLabelText("Password")
        userEvent.type(passwordInput, "notapassword{enter}")
        await screen.findByText(
          "Password must contain at least eight characters including a lowercase letter, an uppercase letter, and a number",
        )
        expect(asFragment()).toMatchSnapshot()
        userEvent.clear(passwordInput)
        userEvent.type(passwordInput, mockPassword + "!{enter}")
        await screen.findByText("Password can only contain letters and numbers")
        expect(asFragment()).toMatchSnapshot()
      })
    })
    describe("error handling", () => {
      test("displays 404 if user not found", async () => {
        const {asFragment} = await renderAccountApp("login")
        userEvent.type(screen.getByLabelText("Email"), "not@user.email")
        userEvent.tab()
        userEvent.type(
          screen.getByLabelText("Password"),
          mockPassword + "{enter}",
        )
        await screen.findByText("404: User not found")
        expect(asFragment()).toMatchSnapshot()
        jest.advanceTimersByTime(3000)
        await waitFor(() => {
          expect(screen.queryByText("404: User not found")).toBeNull()
        })
        expect(asFragment()).toMatchSnapshot()
      })
      test("displays 401 if password incorrect", async () => {
        const {asFragment} = await renderAccountApp("login")
        userEvent.type(screen.getByLabelText("Email"), mockEmail)
        userEvent.type(screen.getByLabelText("Password"), "Wrong123{enter}")
        await screen.findByText("401: Incorrect password")
        expect(asFragment()).toMatchSnapshot()
        jest.advanceTimersByTime(3000)
        await waitFor(() => {
          expect(screen.queryByText("401: Incorrect password")).toBeNull()
        })
        expect(asFragment()).toMatchSnapshot()
      })
      test("shows unexpected error text if status but no message", async () => {
        server.use(
          rest.post("/api/user/login", (_req, res, ctx) =>
            res(ctx.status(500)),
          ),
        )
        await renderAccountApp("login")
        userEvent.type(screen.getByLabelText("Email"), mockEmail)
        userEvent.type(
          screen.getByLabelText("Password"),
          mockPassword + "{enter}",
        )
        await screen.findByText("500: An unexpected error occurred")
      })
      test("shows error text if no status or message", async () => {
        server.use(
          rest.post("/api/user/login", () => {
            throw Error()
          }),
        )
        await renderAccountApp("login")
        userEvent.type(screen.getByLabelText("Email"), mockEmail)
        userEvent.type(
          screen.getByLabelText("Password"),
          mockPassword + "{enter}",
        )
        await screen.findByText("Network Error")
      })
    })
  })

  /* -------------------- Register -------------------- */
  describe("register", () => {
    test("renders form", async () => {
      const {asFragment} = await renderAccountApp("register")
      screen.getByRole("heading", {name: "Create Account"})
      screen.getByLabelText("Email")
      screen.getByLabelText("Password")
      screen.getByLabelText("Confirm Password")
      screen.getByRole("button", {name: "Sign Up"})
      expect(asFragment()).toMatchSnapshot()
    })
    describe("submission", () => {
      test("shows message on success", async () => {
        const {asFragment} = await renderAccountApp("register")
        userEvent.type(screen.getByLabelText("Email"), "new@email.test")
        userEvent.type(screen.getByLabelText("Password"), mockPassword)
        userEvent.type(
          screen.getByLabelText("Confirm Password"),
          mockPassword + "{enter}",
        )
        await screen.findByText("To complete the registration process,", {
          exact: false,
        })
        expect(asFragment()).toMatchSnapshot()
      })
      test("disabled during submission and while error displayed", async () => {
        server.use(rest.post("/api/user/create", mockRequest))
        await renderAccountApp("register")
        userEvent.type(screen.getByLabelText("Email"), mockEmail)
        userEvent.type(screen.getByLabelText("Password"), mockPassword)
        userEvent.type(
          screen.getByLabelText("Confirm Password"),
          mockPassword + "{enter}",
        )
        const submitButton = screen.getByRole("button", {name: "Sign Up"})
        await waitFor(() => {
          expect(submitButton).toBeDisabled()
        })
        expect(mockRequest).toHaveBeenCalledTimes(1)
        userEvent.keyboard("{enter}")
        jest.advanceTimersByTime(3000)
        await waitFor(() => {
          expect(submitButton).not.toBeDisabled()
        })
        expect(mockRequest).toHaveBeenCalledTimes(1)
      })
    })
    describe("validation", () => {
      test("email, password, and password confirmation are required", async () => {
        const {asFragment} = await renderAccountApp("register")
        userEvent.click(screen.getByRole("button", {name: "Sign Up"}))
        await screen.findByText("Email is required")
        screen.getByText("Password is required")
        screen.getByText("Password confirmation is required")
        expect(asFragment()).toMatchSnapshot()
      })
      test("validates email", async () => {
        const {asFragment} = await renderAccountApp("register")
        userEvent.type(screen.getByLabelText("Email"), "notanemail{enter}")
        await screen.findByText("Invalid email")
        expect(asFragment()).toMatchSnapshot()
      })
      test("validates password", async () => {
        const {asFragment} = await renderAccountApp("register")
        const passwordInput = screen.getByLabelText("Password")
        userEvent.type(passwordInput, "notapassword{enter}")
        await screen.findByText(
          "Password must contain at least eight characters including a lowercase letter, an uppercase letter, and a number",
        )
        expect(asFragment()).toMatchSnapshot()
        userEvent.clear(passwordInput)
        userEvent.type(passwordInput, mockPassword + "!{enter}")
        await screen.findByText("Password can only contain letters and numbers")
        expect(asFragment()).toMatchSnapshot()
      })
      test("validates password confirmation", async () => {
        const {asFragment} = await renderAccountApp("register")
        userEvent.type(
          screen.getByLabelText("Confirm Password"),
          "notapassword{enter}",
        )
        await screen.findByText("Passwords must match")
        expect(asFragment()).toMatchSnapshot()
      })
    })
    describe("error handling", () => {
      test("shows 400 if user already exists", async () => {
        const {asFragment} = await renderAccountApp("register")
        userEvent.type(screen.getByLabelText("Email"), mockEmail)
        userEvent.type(screen.getByLabelText("Password"), mockPassword)
        userEvent.type(
          screen.getByLabelText("Confirm Password"),
          mockPassword + "{enter}",
        )
        await screen.findByText("400: User already exists")
        expect(asFragment()).toMatchSnapshot()
        jest.advanceTimersByTime(3000)
        await waitFor(() => {
          expect(screen.queryByText("400: User already exists")).toBeNull()
        })
        expect(asFragment()).toMatchSnapshot()
      })
      test("shows unexpected error text if status but no message", async () => {
        server.use(
          rest.post("/api/user/create", (_req, res, ctx) =>
            res(ctx.status(500)),
          ),
        )
        await renderAccountApp("register")
        userEvent.type(screen.getByLabelText("Email"), mockEmail)
        userEvent.type(screen.getByLabelText("Password"), mockPassword)
        userEvent.type(
          screen.getByLabelText("Confirm Password"),
          mockPassword + "{enter}",
        )
        await screen.findByText("500: An unexpected error occurred")
      })
      test("shows error text if no status or message", async () => {
        server.use(
          rest.post("/api/user/create", () => {
            throw Error()
          }),
        )
        await renderAccountApp("register")
        userEvent.type(screen.getByLabelText("Email"), mockEmail)
        userEvent.type(screen.getByLabelText("Password"), mockPassword)
        userEvent.type(
          screen.getByLabelText("Confirm Password"),
          mockPassword + "{enter}",
        )
        await screen.findByText("Network Error")
      })
    })
  })

  /* -------------------- Forgot Password -------------------- */
  describe("forgot-password", () => {
    test("renders form", async () => {
      const {asFragment} = await renderAccountApp("forgot-password")
      screen.getByRole("heading", {name: "Reset Password"})
      screen.getByLabelText("Email")
      screen.getByRole("button", {name: "Send Link"})
      expect(asFragment()).toMatchSnapshot()
    })
    describe("submission", () => {
      test("shows message on success", async () => {
        const {asFragment} = await renderAccountApp("forgot-password")
        userEvent.type(screen.getByLabelText("Email"), mockEmail + "{enter}")
        await screen.findByText("To finish resetting your password,", {
          exact: false,
        })
        expect(asFragment()).toMatchSnapshot()
      })
      test("disabled during submission and while error displayed", async () => {
        server.use(rest.post("/api/user/update-password", mockRequest))
        await renderAccountApp("forgot-password")
        userEvent.type(screen.getByLabelText("Email"), "not@user.email{enter}")
        const submitButton = screen.getByRole("button", {name: "Send Link"})
        await waitFor(() => {
          expect(submitButton).toBeDisabled()
        })
        expect(mockRequest).toHaveBeenCalledTimes(1)
        userEvent.keyboard("{enter}")
        jest.advanceTimersByTime(3000)
        await waitFor(() => {
          expect(submitButton).not.toBeDisabled()
        })
        expect(mockRequest).toHaveBeenCalledTimes(1)
      })
    })
    describe("validation", () => {
      test("email is required", async () => {
        const {asFragment} = await renderAccountApp("forgot-password")
        userEvent.click(screen.getByRole("button", {name: "Send Link"}))
        await screen.findByText("Email is required")
        expect(asFragment()).toMatchSnapshot()
      })
      test("validates email", async () => {
        const {asFragment} = await renderAccountApp("forgot-password")
        userEvent.type(screen.getByLabelText("Email"), "notanemail{enter}")
        await screen.findByText("Invalid email")
        expect(asFragment()).toMatchSnapshot()
      })
    })
    describe("error handling", () => {
      test("displays 404 if user not found", async () => {
        const {asFragment} = await renderAccountApp("forgot-password")
        userEvent.type(screen.getByLabelText("Email"), "not@user.email{enter}")
        await screen.findByText("404: User not found")
        expect(asFragment()).toMatchSnapshot()
        jest.advanceTimersByTime(3000)
        await waitFor(() => {
          expect(screen.queryByText("404: User not found")).toBeNull()
        })
        expect(asFragment()).toMatchSnapshot()
      })
      test("shows unexpected error text if status but no message", async () => {
        server.use(
          rest.post("/api/user/update-password", (_req, res, ctx) =>
            res(ctx.status(500)),
          ),
        )
        await renderAccountApp("forgot-password")
        userEvent.type(screen.getByLabelText("Email"), mockEmail + "{enter}")
        await screen.findByText("500: An unexpected error occurred")
      })
      test("shows error text if no status or message", async () => {
        server.use(
          rest.post("/api/user/update-password", () => {
            throw Error()
          }),
        )
        await renderAccountApp("forgot-password")
        userEvent.type(screen.getByLabelText("Email"), mockEmail + "{enter}")
        await screen.findByText("Network Error")
      })
    })
  })

  /* -------------------- Update Password -------------------- */
  describe("update-password", () => {
    test("renders form", async () => {
      const {asFragment} = await renderAccountApp("update-password")
      screen.getByRole("heading", {name: "Reset Password"})
      screen.getByLabelText("New Password")
      screen.getByLabelText("Confirm New Password")
      screen.getByRole("button", {name: "Save New Password"})
      expect(asFragment()).toMatchSnapshot()
    })
    describe("submission", () => {
      test("navigates to home page on success", async () => {
        mockParams = {token: mockToken}
        const {asFragment} = await renderAccountApp("update-password")
        userEvent.type(screen.getByLabelText("New Password"), mockPassword)
        userEvent.type(
          screen.getByLabelText("Confirm New Password"),
          mockPassword + "{enter}",
        )
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith("/", {replace: true})
        })
        expect(asFragment()).toMatchSnapshot()
      })
      test("disabled during submission and while error displayed", async () => {
        mockParams = {token: "invalid-token"}
        server.use(rest.patch("/api/user/update-password", mockRequest))
        await renderAccountApp("update-password")
        userEvent.type(screen.getByLabelText("New Password"), mockPassword)
        userEvent.type(
          screen.getByLabelText("Confirm New Password"),
          mockPassword + "{enter}",
        )
        const submitButton = screen.getByRole("button", {
          name: "Save New Password",
        })
        await waitFor(() => {
          expect(submitButton).toBeDisabled()
        })
        expect(mockRequest).toHaveBeenCalledTimes(1)
        userEvent.keyboard("{enter}")
        jest.advanceTimersByTime(3000)
        await waitFor(() => {
          expect(submitButton).not.toBeDisabled()
        })
        expect(mockRequest).toHaveBeenCalledTimes(1)
      })
    })
    describe("validation", () => {
      test("password and password confirmation are required", async () => {
        const {asFragment} = await renderAccountApp("update-password")
        userEvent.click(screen.getByRole("button", {name: "Save New Password"}))
        await screen.findByText("Password is required")
        screen.getByText("Password confirmation is required")
        expect(asFragment()).toMatchSnapshot()
      })
      test("validates password", async () => {
        const {asFragment} = await renderAccountApp("update-password")
        const passwordInput = screen.getByLabelText("New Password")
        userEvent.type(passwordInput, "notapassword{enter}")
        await screen.findByText(
          "Password must contain at least eight characters including a lowercase letter, an uppercase letter, and a number",
        )
        expect(asFragment()).toMatchSnapshot()
        userEvent.clear(passwordInput)
        userEvent.type(passwordInput, mockPassword + "!{enter}")
        await screen.findByText("Password can only contain letters and numbers")
        expect(asFragment()).toMatchSnapshot()
      })
      test("validates password confirmation", async () => {
        const {asFragment} = await renderAccountApp("update-password")
        userEvent.type(
          screen.getByLabelText("Confirm New Password"),
          "notapassword{enter}",
        )
        await screen.findByText("Passwords must match")
        expect(asFragment()).toMatchSnapshot()
      })
    })
    describe("error handling", () => {
      test("shows error if token invalid", async () => {
        const {asFragment} = await renderAccountApp("update-password")
        userEvent.type(screen.getByLabelText("New Password"), mockPassword)
        userEvent.type(
          screen.getByLabelText("Confirm New Password"),
          mockPassword + "{enter}",
        )
        await screen.findByText("401: Invalid token")
        expect(asFragment()).toMatchSnapshot()
        jest.advanceTimersByTime(3000)
        await waitFor(() => {
          expect(screen.queryByText("401: Invalid token")).toBeNull()
        })
        expect(asFragment()).toMatchSnapshot()
      })
      test("shows unexpected error text if status but no message", async () => {
        server.use(
          rest.patch("/api/user/update-password", (_req, res, ctx) =>
            res(ctx.status(500)),
          ),
        )
        await renderAccountApp("update-password")
        userEvent.type(screen.getByLabelText("New Password"), mockPassword)
        userEvent.type(
          screen.getByLabelText("Confirm New Password"),
          mockPassword + "{enter}",
        )
        await screen.findByText("500: An unexpected error occurred")
      })
      test("shows error text if no status or message", async () => {
        server.use(
          rest.patch("/api/user/update-password", () => {
            throw Error()
          }),
        )
        await renderAccountApp("update-password")
        userEvent.type(screen.getByLabelText("New Password"), mockPassword)
        userEvent.type(
          screen.getByLabelText("Confirm New Password"),
          mockPassword + "{enter}",
        )
        await screen.findByText("Network Error")
      })
    })
  })
})
