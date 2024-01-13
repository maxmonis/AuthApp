import {screen, waitFor} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {renderWithWrappers} from "src/msw/renderWithWrappers"
import {localToken} from "src/utils/storage"
import {mockToken} from "../mocks/authMocks"
import {setAuthToken} from "../utils/setAuthToken"
import {ActivateAccount} from "./ActivateAccount"

const mockNavigate = jest.fn()
let mockParams = {token: "invalid-token"}
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}))

describe("ActivateAccount", () => {
  test("shows message if token invalid", async () => {
    const {asFragment} = renderWithWrappers(<ActivateAccount />)
    await screen.findByText(
      "We were unable to activate your account using the provided link.",
    )
    expect(asFragment()).toMatchSnapshot()
  })
  test("message includes link to login if no user is signed in", async () => {
    renderWithWrappers(<ActivateAccount />)
    await screen.findByText(
      "We were unable to activate your account using the provided link.",
    )
    expect(
      screen.getByRole("link", {name: "visit your account"}),
    ).toHaveAttribute("href", "/login")
  })
  test("message includes link to home if user is signed in", async () => {
    setAuthToken({token: mockToken})
    renderWithWrappers(<ActivateAccount />)
    await screen.findByText(
      "We were unable to activate your account using the provided link.",
    )
    expect(
      screen.getByRole("link", {name: "visit your account"}),
    ).toHaveAttribute("href", "/")
  })
  test("message includes link to register", async () => {
    renderWithWrappers(<ActivateAccount />)
    await screen.findByText(
      "We were unable to activate your account using the provided link.",
    )
    expect(screen.getByRole("link", {name: "sign up again"})).toHaveAttribute(
      "href",
      "/register",
    )
  })
  test("clicking register link logs user out", async () => {
    setAuthToken({token: mockToken})
    renderWithWrappers(<ActivateAccount />)
    await screen.findByText(
      "We were unable to activate your account using the provided link.",
    )
    userEvent.click(screen.getByRole("link", {name: "sign up again"}))
    expect(localToken.get()).toBeNull()
  })
  test("navigates to home page on success", async () => {
    mockParams = {token: mockToken}
    renderWithWrappers(<ActivateAccount />)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/", {replace: true})
    })
  })
})
