import siteLogo from "./assets/logo192.png"
import {activatePage} from "./pages/activatePage"
import {authPage, isAuthRoute} from "./pages/authPage"
import {homePage} from "./pages/homePage"
import "./styles/global.css"

export let html = String.raw

let [, route, token] = window.location.pathname.split("/")
if (route === "logout") {
  localStorage.removeItem("token")
  window.location.pathname = "/login"
} else if (isAuthRoute(route)) authPage({route})
else if (route === "update-password" && token) authPage({route, token})
else if (route === "activate" && token) activatePage(token)
else if (route) window.location.pathname = "/"
else homePage()

let header = document.createElement("header")
header.classList.add("app-header")
header.innerHTML = html`
  <a class="app-logo" href="/">
    <img alt="AuthApp logo" src="${siteLogo}" />AuthApp
  </a>
`
let app = document.querySelector<HTMLDivElement>("#app")!
app.onscroll = () => {
  header.classList.toggle("border", app.scrollTop > 0)
}
document.body.insertBefore(header, app)

let theme = localStorage.getItem("theme") ?? ""
if (!["light", "dark"].includes(theme))
  theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"

let toggle = document.createElement("button")
toggle.classList.add("theme-toggle")
toggle.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark"
  localStorage.setItem("theme", theme)
  applyTheme()
})
header.appendChild(toggle)

function applyTheme() {
  document.body.classList.toggle("dark", theme === "dark")
  toggle.innerText = theme === "dark" ? "🌛" : "🌞"
}

applyTheme()
