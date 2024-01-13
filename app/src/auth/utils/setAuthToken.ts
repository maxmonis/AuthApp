import axios from "axios"
import {localToken} from "src/utils/storage"
import {TokenRes} from "./authTypes"

export function setAuthToken({refresh = false, token = localToken.get()}) {
  if (token) {
    axios.defaults.headers.common["X-Auth-Token"] = token
    localToken.set(token)
    if (refresh)
      axios
        .get<TokenRes>("/api/user/refresh")
        .then(res => setAuthToken({token: res.data.token}))
        .catch(() => setAuthToken({token: null}))
  } else {
    delete axios.defaults.headers.common["X-Auth-Token"]
    localToken.remove()
  }
}
