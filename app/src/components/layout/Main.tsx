import React from "react"
import {useNavigate} from "react-router-dom"
import {useAuth} from "src/auth/hooks/useAuth"
import {useUpdateAuth} from "src/auth/hooks/useUpdateAuth"
import {localDark} from "src/utils/storage"

export function Main({children}: React.PropsWithChildren) {
  const {data: user} = useAuth()
  const navigate = useNavigate()
  const updateAuth = useUpdateAuth()
  const storageDark = localDark.get()
  const [dark, setDark] = React.useState(
    storageDark === null && typeof matchMedia !== "undefined"
      ? matchMedia("(prefers-color-scheme: dark)").matches
      : storageDark ?? false,
  )
  return (
    <main {...(dark && {className: "dark"})}>
      <div className="h-screen w-screen overflow-x-hidden bg-slate-100 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-50">
        <nav className="flex items-center justify-between gap-6 px-6 py-4">
          <button
            aria-label="toggle dark mode"
            className="text-2xl transition-transform [text-shadow:_2px_2px_2px_rgb(0_0_0_/_50%)] active:scale-90"
            onClick={() => {
              setDark(!dark)
              localDark.set(!dark)
            }}
          >
            {dark ? "🌜" : "🌞"}
          </button>
          {user && (
            <div className="flex flex-wrap items-center justify-end gap-x-4">
              <p>{user.email}</p>
              <button
                className="underline"
                onClick={() =>
                  updateAuth(null).then(() =>
                    navigate("/login", {replace: true}),
                  )
                }
              >
                Logout
              </button>
            </div>
          )}
        </nav>
        {children}
      </div>
    </main>
  )
}
