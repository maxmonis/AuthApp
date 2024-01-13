import axios from "axios"
import {useQuery} from "react-query"
import {localToken} from "src/utils/storage"
import {UserRes} from "../utils/authTypes"

export function useAuth() {
  return useQuery({
    async queryFn() {
      try {
        if (!localToken.get()) throw Error("No token")
        const {data} = await axios.get<UserRes>("/api/user")
        return data
      } catch (error) {
        return null
      }
    },
    queryKey: "auth",
  })
}
