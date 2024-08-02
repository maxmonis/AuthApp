import {html} from "../main"

export async function homePage() {
  let token = localStorage.getItem("token")
  if (!token) {
    window.location.pathname = "/login"
    return
  }
  let init = {headers: {accepts: "application/json", "X-Auth-Token": token}}
  try {
    let res = await fetch("api/user", init)
    if (!res.ok) throw res
    let user: {email: string} = await res.json()
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = html`
      <div class="home-page">
        <h1>Welcome!</h1>
        <p>Signed in as ${user.email}</p>
        <a href="/logout">Logout</a>
      </div>
    `
    res = await fetch("api/user/refresh", init)
    if (!res.ok) throw res
    let data: {token: string} = await res.json()
    localStorage.setItem("token", data.token)
  } catch (error) {
    window.location.pathname = "/logout"
  }
}
