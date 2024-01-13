import React from "react"
import ReactDOM from "react-dom/client"
import {setAuthToken} from "./auth/utils/setAuthToken"
import {App} from "./components/layout/App"
import "./styles/index.css"

startMSW().then(() => {
  setAuthToken({refresh: true})
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})

async function startMSW() {
  if (process.env.REACT_APP_USE_MSW) {
    const {worker} = require("./msw/browser")
    return worker.start()
  }
}
