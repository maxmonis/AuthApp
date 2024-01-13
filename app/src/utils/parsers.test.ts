import {AxiosError} from "axios"
import {parseError} from "./parsers"

const mockErrorText = "Mock error text"
const mockErrorStatus = 400

describe("parsers", () => {
  describe("parseError", () => {
    test("returns message if string", () => {
      expect(parseError(mockErrorText)).toStrictEqual({message: mockErrorText})
    })
    test("returns message if Error with text", () => {
      expect(parseError(Error(mockErrorText))).toStrictEqual({
        message: mockErrorText,
      })
    })
    test("returns message and status if AxiosError with text", async () => {
      expect(
        parseError(
          new AxiosError(
            mockErrorText,
            mockErrorStatus.toString(),
            // @ts-expect-error
            {},
            {},
            {data: mockErrorText, status: mockErrorStatus},
          ),
        ),
      ).toStrictEqual({message: mockErrorText, status: mockErrorStatus})
    })
    test("returns empty object if no message exists", () => {
      expect(parseError(null)).toStrictEqual({})
      expect(parseError(undefined)).toStrictEqual({})
    })
  })
})
