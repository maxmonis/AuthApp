import {render} from "@testing-library/react"
import {QueryClient, QueryClientProvider} from "react-query"
import {BrowserRouter} from "react-router-dom"

const queryClient = new QueryClient({defaultOptions: {queries: {retry: false}}})

export function renderWithWrappers(element: React.ReactNode) {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{element}</BrowserRouter>
    </QueryClientProvider>,
  )
}
