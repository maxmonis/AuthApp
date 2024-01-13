import {Navigate} from "react-router-dom"
import {useAuth} from "src/auth/hooks/useAuth"

export function HomePage() {
  const {data: user, isLoading: authenticating} = useAuth()
  if (authenticating) return <></>
  if (!user) return <Navigate replace to="/login" />
  return (
    <div className="px-6 py-4">
      <h1 className="my-40 text-center text-2xl">Welcome to AuthApp!</h1>
    </div>
  )
}
