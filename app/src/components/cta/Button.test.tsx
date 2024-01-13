import {render, screen, within} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {Button} from "./Button"

const mockText = "Mock Text"

describe("Button", () => {
  test("renders button with text", () => {
    render(<Button text={mockText} />)
    screen.getByRole("button", {name: mockText})
  })
  test("applies custom class name", () => {
    render(<Button className="custom-class" text={mockText} />)
    expect(screen.getByRole("button", {name: mockText})).toHaveClass(
      "custom-class",
    )
  })
  test("handles click event", () => {
    const onClickMock = jest.fn()
    render(<Button onClick={onClickMock} text={mockText} />)
    userEvent.click(screen.getByRole("button", {name: mockText}))
    expect(onClickMock).toHaveBeenCalled()
  })
  test("disabled when loading", () => {
    render(<Button loading text={mockText} />)
    expect(screen.getByRole("button", {name: mockText})).toBeDisabled()
  })
  test("can be disabled by prop", () => {
    render(<Button disabled text={mockText} />)
    expect(screen.getByRole("button", {name: mockText})).toBeDisabled()
  })
  test("does not trigger click event when disabled", () => {
    const onClickMock = jest.fn()
    render(<Button disabled onClick={onClickMock} text={mockText} />)
    userEvent.click(screen.getByRole("button", {name: mockText}))
    expect(onClickMock).not.toHaveBeenCalled()
  })
  test('default type is "button"', () => {
    render(<Button text={mockText} />)
    expect(screen.getByRole("button", {name: mockText})).toHaveAttribute(
      "type",
      "button",
    )
  })
  test("type can be set using prop", () => {
    render(<Button text={mockText} type="submit" />)
    expect(screen.getByRole("button", {name: mockText})).toHaveAttribute(
      "type",
      "submit",
    )
  })
  test("renders loading spinner when loading prop is true", () => {
    render(<Button loading text={mockText} />)
    within(screen.getByRole("button", {name: mockText})).getByRole("alert")
  })
  test("does not render loading spinner when loading prop is omitted", () => {
    render(<Button text={mockText} />)
    expect(
      within(screen.getByRole("button", {name: mockText})).queryByRole("alert"),
    ).toBeNull()
  })
  test("applies aria-busy attribute during loading", () => {
    render(<Button loading text={mockText} />)
    expect(screen.getByRole("button", {name: mockText})).toHaveAttribute(
      "aria-busy",
      "true",
    )
  })
  test("does not apply aria-busy attribute when not loading", () => {
    render(<Button text={mockText} />)
    expect(screen.getByRole("button", {name: mockText})).not.toHaveAttribute(
      "aria-busy",
    )
  })
  test("applies default styles to the button", () => {
    render(<Button text={mockText} />)
    expect(screen.getByRole("button", {name: mockText})).toHaveClass(
      "bg-blue-600",
    )
  })
  test("applies custom styles in addition to default styles", () => {
    const mockCustomClass = "mock-custom-class"
    render(<Button className={mockCustomClass} text={mockText} />)
    expect(screen.getByRole("button", {name: mockText})).toHaveClass(
      "bg-blue-600",
      mockCustomClass,
    )
  })
  test("renders button with additional HTML attributes", () => {
    const mockDataTestId = "mock-data-test-id"
    render(<Button data-testid={mockDataTestId} text={mockText} />)
    screen.getByTestId(mockDataTestId)
  })
})
