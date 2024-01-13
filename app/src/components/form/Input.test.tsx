import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {Input} from "./Input"

const mockError = "Mock Error"
const mockLabel = "Mock Label"
const mockName = "Mock Name"

describe("Input", () => {
  test("renders input with label", () => {
    render(<Input label={mockLabel} name={mockName} />)
    screen.getByLabelText(mockLabel)
  })
  test("applies custom class name", () => {
    const mockCustomClass = "mock-custom-class"
    const {
      container: {firstChild},
    } = render(
      <Input className={mockCustomClass} label={mockLabel} name={mockName} />,
    )
    expect(firstChild).toHaveClass(mockCustomClass)
  })
  test("applies error styles when error is present", () => {
    render(<Input error={mockError} label={mockLabel} name={mockName} />)
    expect(screen.getByLabelText(mockLabel)).toHaveClass(
      "border-red-600",
      "dark:border-red-500",
    )
  })
  test("does not apply error styles when error is not present", () => {
    render(<Input label={mockLabel} name={mockName} />)
    expect(screen.getByLabelText(mockLabel)).toHaveClass("border-slate-700")
  })
  test("renders error message when error is present", () => {
    render(<Input error={mockError} label={mockLabel} name={mockName} />)
    screen.getByText(mockError)
  })
  test("fires onChange event handler", () => {
    const mockValue = "Mock Value"
    const handleChange = jest.fn()
    render(
      <Input
        label={mockLabel}
        name={mockName}
        onChange={e => handleChange(e.target.value)}
      />,
    )
    userEvent.type(screen.getByLabelText(mockLabel), mockValue)
    expect(handleChange).toHaveBeenCalledWith(mockValue)
  })
  test("renders input with additional HTML attributes", () => {
    const dataTestId = "custom-input"
    render(
      <Input
        autoComplete="off"
        data-testid={dataTestId}
        label={mockLabel}
        name={mockName}
      />,
    )
    expect(screen.getByTestId(dataTestId)).toHaveAttribute(
      "autoComplete",
      "off",
    )
  })
  test("renders input with placeholder", () => {
    const placeholderText = "Enter your text"
    render(
      <Input label={mockLabel} name={mockName} placeholder={placeholderText} />,
    )
    screen.getByPlaceholderText(placeholderText)
  })
  test("renders input with a default value", () => {
    const defaultValue = "Default Text"
    render(
      <Input defaultValue={defaultValue} label={mockLabel} name={mockName} />,
    )
    screen.getByDisplayValue(defaultValue)
  })
})
