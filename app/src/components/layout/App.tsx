import {QueryClient, QueryClientProvider} from "react-query"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import {AccountApp} from "src/auth/components/AccountApp"
import {ActivateAccount} from "src/auth/components/ActivateAccount"
import {accountRoutes} from "src/auth/utils/authConstants"
import {HomePage} from "src/components/layout/HomePage"
import {Main} from "./Main"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60 * 60 * 1000,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Main>
          <Routes>
            {accountRoutes.map(route => (
              <Route
                element={<AccountApp key={route} {...{route}} />}
                key={route}
                path={
                  `/${route}` + (route === "update-password" ? "/:token" : "")
                }
              />
            ))}
            <Route element={<ActivateAccount />} path="/activate/:token" />
            <Route element={<HomePage />} path="/" />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Routes>
        </Main>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
