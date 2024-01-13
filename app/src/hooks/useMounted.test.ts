import {renderHook} from "@testing-library/react"
import {useMounted} from "./useMounted"

const mockCallback = jest.fn()

afterEach(() => {
  jest.resetAllMocks()
})

describe("useMounted", () => {
  test("invokes callback on mount", () => {
    renderHook(() => useMounted(mockCallback))
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })
  test("does not invoke callback on unmount", () => {
    const {unmount} = renderHook(() => useMounted(mockCallback))
    expect(mockCallback).toHaveBeenCalledTimes(1)
    unmount()
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })
  test("does not invoke callback on rerender", () => {
    const {rerender} = renderHook(() => useMounted(mockCallback))
    expect(mockCallback).toHaveBeenCalledTimes(1)
    rerender()
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })
})
