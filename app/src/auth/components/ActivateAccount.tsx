import axios from "axios"
import React from "react"
import {Link, useNavigate, useParams} from "react-router-dom"
import {AccountLayout} from "src/auth/components/AccountLayout"
import {useMounted} from "src/hooks/useMounted"
import {useAuth} from "../hooks/useAuth"
import {useUpdateAuth} from "../hooks/useUpdateAuth"
import {TokenRes} from "../utils/authTypes"

export function ActivateAccount() {
  const navigate = useNavigate()
  const {token} = useParams<{token: string}>()
  const {data: user} = useAuth()
  const updateAuth = useUpdateAuth()
  const [error, setError] = React.useState(false)
  useMounted(async () => {
    try {
      const res = await axios.post<TokenRes>("/api/user/activate", {token})
      await updateAuth(res.data.token)
      navigate("/", {replace: true})
    } catch (error) {
      console.error(error)
      setError(true)
    }
  })
  if (!error) return <></>
  return (
    <AccountLayout title="Invalid Link">
      <p>We were unable to activate your account using the provided link.</p>
      <p>
        If you've already completed setup,{" "}
        <Link
          className="whitespace-nowrap text-blue-600 dark:text-blue-400"
          replace
          to={user ? "/" : "/login"}
        >
          visit your account
        </Link>
        .
      </p>
      <p>
        If your activation link has expired,{" "}
        <Link
          className="whitespace-nowrap text-blue-600 dark:text-blue-400"
          onClick={() => updateAuth(null)}
          replace
          to="/register"
        >
          sign up again
        </Link>
        .
      </p>
    </AccountLayout>
  )
}
