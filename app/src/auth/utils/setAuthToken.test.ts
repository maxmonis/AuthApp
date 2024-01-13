import {waitFor} from "@testing-library/react"
import axios from "axios"
import {mockRefreshedToken, mockToken} from "src/auth/mocks/authMocks"
import {localToken} from "src/utils/storage"
import {setAuthToken} from "./setAuthToken"

describe("setAuthToken", () => {
  test("sets axios header and localToken to the value it receives", async () => {
    localToken.remove()
    setAuthToken({token: mockToken})
    expect(localToken.get()).toStrictEqual(mockToken)
    expect(axios.defaults.headers.common["X-Auth-Token"]).toStrictEqual(
      mockToken,
    )
  })
  test("removes axios header and localToken if passed null", () => {
    axios.defaults.headers.common["X-Auth-Token"] = mockToken
    localToken.set(mockToken)
    setAuthToken({token: null})
    expect(localToken.get()).toBeNull()
    expect(axios.defaults.headers.common["X-Auth-Token"]).toBeUndefined()
  })
  test("refreshes axios header and localToken if passed arg", async () => {
    localToken.set(mockToken)
    setAuthToken({refresh: true})
    await waitFor(() => {
      expect(localToken.get()).toStrictEqual(mockRefreshedToken)
    })
    expect(axios.defaults.headers.common["X-Auth-Token"]).toStrictEqual(
      mockRefreshedToken,
    )
  })
  test("clears axios header and localToken if refresh fails", async () => {
    localToken.set("expired-token")
    setAuthToken({refresh: true})
    await waitFor(() => {
      expect(localToken.get()).toBeNull()
    })
    expect(axios.defaults.headers.common["X-Auth-Token"]).toBeUndefined()
  })
})
