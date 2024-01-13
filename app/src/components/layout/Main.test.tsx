import {screen, waitFor} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {useAuth} from "src/auth/hooks/useAuth"
import {mockEmail, mockToken} from "src/auth/mocks/authMocks"
import {renderWithWrappers} from "src/msw/renderWithWrappers"
import {localDark, localToken} from "src/utils/storage"
import {Main} from "./Main"

let mockUser: ReturnType<typeof useAuth>["data"] = null
jest.mock("react-query", () => ({
  ...jest.requireActual("react-query"),
  useQuery: () => ({data: mockUser}),
}))

const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}))

function renderMain() {
  const {
    asFragment,
    container: {firstChild},
  } = renderWithWrappers(<Main>{null}</Main>)
  return {asFragment, firstChild}
}

describe("Main", () => {
  describe("dark mode", () => {
    test("button allows dark mode toggle", async () => {
      const {asFragment, firstChild} = renderMain()
      const darkModeToggle = screen.getByRole("button", {
        name: "toggle dark mode",
      })
      screen.getByText("🌞")
      expect(firstChild).not.toHaveClass("dark")
      expect(localDark.get()).toBeNull()
      expect(asFragment()).toMatchSnapshot()
      userEvent.click(darkModeToggle)
      await screen.findByText("🌜")
      expect(firstChild).toHaveClass("dark")
      expect(localDark.get()).toStrictEqual(true)
      expect(asFragment()).toMatchSnapshot()
      userEvent.click(darkModeToggle)
      await screen.findByText("🌞")
      expect(firstChild).not.toHaveClass("dark")
      expect(localDark.get()).toStrictEqual(false)
    })
    test("uses dark mode preference from localStorage", () => {
      jest.spyOn(localDark, "get").mockReturnValueOnce(true)
      const {firstChild} = renderMain()
      screen.getByText("🌜")
      expect(firstChild).toHaveClass("dark")
    })
    test("uses dark mode preference from browser if none in localStorage", () => {
      jest.spyOn(localDark, "get").mockReturnValueOnce(null)
      Object.defineProperty(window, "matchMedia", {
        value: jest.fn().mockImplementation(() => ({matches: true})),
      })
      const {firstChild} = renderMain()
      screen.getByText("🌜")
      expect(firstChild).toHaveClass("dark")
    })
  })
  describe("user menu", () => {
    test("does not display logout button if no logged in user", async () => {
      renderMain()
      expect(screen.queryByRole("button", {name: "Logout"})).toBeNull()
    })
    test("displays logout button and email if user logged in", async () => {
      mockUser = {email: mockEmail}
      localToken.set(mockToken)
      const {asFragment} = renderMain()
      screen.getByText(mockEmail)
      expect(asFragment()).toMatchSnapshot()
      userEvent.click(screen.getByRole("button", {name: "Logout"}))
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/login", {replace: true})
      })
      expect(localToken.get()).toBeNull()
    })
  })
})
