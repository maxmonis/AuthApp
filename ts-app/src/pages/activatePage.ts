import {html} from "../main"

export async function activatePage(token: string) {
  try {
    let res = await fetch("/api/user/activate", {
      body: JSON.stringify({token}),
      headers: {"Content-Type": "application/json"},
      method: "POST",
    })
    if (!res.ok) throw res
    let data: {token: string} = await res.json()
    localStorage.setItem("token", data.token)
    window.location.pathname = "/"
  } catch (error) {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = html`
      <div class="auth-page">
        <h1>Invalid Link</h1>
        <p>The activation link you used is invalid or expired.</p>
        <br />
        <a href="/register">Sign Up Again</a>
      </div>
    `
    document
      .querySelector<HTMLAnchorElement>(".auth-page a")!
      .addEventListener("click", () => {
        localStorage.removeItem("token")
      })
  }
}
