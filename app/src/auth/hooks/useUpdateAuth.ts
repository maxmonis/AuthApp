import {useQueryClient} from "react-query"
import {setAuthToken} from "../utils/setAuthToken"

export function useUpdateAuth() {
  const queryClient = useQueryClient()
  return async (token: string | null) => {
    setAuthToken({token})
    if (token) await queryClient.invalidateQueries("auth")
    else queryClient.setQueryData("auth", null)
  }
}
