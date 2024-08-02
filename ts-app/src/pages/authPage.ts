import {html} from "../main"

export function authPage({
  route,
  token,
}:
  | {route: AuthRoute; token?: never}
  | {route: "update-password"; token: string}) {
  if (localStorage.getItem("token")) {
    window.location.pathname = "/"
    return
  }
  let buttonText = "Send Link"
  if (route === "update-password") buttonText = "Save New Password"
  else if (route === "login") buttonText = "Sign In"
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = html`
    <div class="auth-page">
      <h1>
        ${route
          .split("-")
          .map(word => word[0].toUpperCase() + word.slice(1))
          .join(" ")}
      </h1>
      <form novalidate>
        ${["login", "register", "forgot-password"].includes(route)
          ? html`
              <label for="email">Email</label>
              <input autofocus id="email" maxlength="40" type="email" />
            `
          : ""}
        ${["login", "register", "update-password"].includes(route)
          ? html`
              <label for="password">
                ${route === "update-password" ? "New " : ""}Password
              </label>
              <input
                ${route === "update-password" ? "autofocus" : ""}
                id="password"
                maxlength="40"
                type="password"
              />
            `
          : ""}
        ${["register", "update-password"].includes(route)
          ? html`
              <label for="password2">
                Confirm ${route === "update-password" ? "New " : ""}Password
              </label>
              <input id="password2" maxlength="40" type="password" />
            `
          : ""}
        <button type="submit">${buttonText}</button>
      </form>
      ${route === "login"
        ? html`<div><a href="/forgot-password">Forgot Password</a></div>`
        : ""}
      <div>
        ${route === "update-password"
          ? html`<a href="/login">Return to Login</a>`
          : html`
              <p>
                ${route === "register"
                  ? html`Already a member? <a href="/login">Login</a>`
                  : html`Need an account? <a href="/register">Register</a>`}
              </p>
            `}
      </div>
    </div>
  `
  let page = document.querySelector<HTMLDivElement>(".auth-page")!
  let form = page.querySelector("form")!
  let emailInput = form.querySelector<HTMLInputElement>("#email")
  let passwordInput = form.querySelector<HTMLInputElement>("#password")
  let password2Input = form.querySelector<HTMLInputElement>("#password2")
  let inputs = form.querySelectorAll("input")
  let button = form.querySelector("button")!
  for (let input of inputs) input.addEventListener("input", clearErrors)
  function clearErrors() {
    for (let input of inputs) input.classList.remove("error")
    for (let error of form.querySelectorAll("small")) form.removeChild(error)
  }
  form.addEventListener("submit", async e => {
    e.preventDefault()
    clearErrors()
    if (button.ariaBusy || button.disabled) return
    let email = emailInput?.value.trim()
    let password = passwordInput?.value.trim()
    let password2 = password2Input?.value.trim()
    let errors = {email: "", password: "", password2: ""}
    if (typeof email === "string")
      if (!email) errors.email = "Email is required"
      else if (!/^[a-zA-Z\d._-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/.test(email))
        errors.email = "Invalid email"
    if (typeof password === "string")
      if (!password) errors.password = "Password is required"
      else if (!/^[a-zA-Z\d]+$/.test(password))
        errors.password = "Password can only contain letters and numbers"
      else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password))
        errors.password =
          "Password must contain at least eight characters including " +
          "a lowercase letter, an uppercase letter, and a number"
    if (typeof password2 === "string")
      if (!password2) errors.password2 = "Password confirmation is required"
      else if (password2 !== password) errors.password2 = "Passwords must match"
    for (let input of inputs) {
      let error = errors[input.id as keyof typeof errors]
      if (error) {
        input.classList.add("error")
        let errorMessage = document.createElement("small")
        errorMessage.innerText = error
        form.insertBefore(errorMessage, input.nextSibling)
      }
    }
    let invalidInput = form.querySelector<HTMLInputElement>("input.error")
    if (invalidInput) {
      invalidInput.focus()
      return
    }
    button.ariaBusy = "true"
    button.innerText = "Submitting..."
    try {
      let res = await fetch(`/api/user/${route}`, {
        body: JSON.stringify({email, password, token}),
        headers: {"Content-Type": "application/json"},
        method: route === "update-password" ? "PATCH" : "POST",
      })
      if (!res.ok) throw res
      if (["login", "update-password"].includes(route)) {
        let data: {token: string} = await res.json()
        localStorage.setItem("token", data.token)
        window.location.pathname = "/"
      } else
        page.innerHTML = html`
          <h1>Email Sent</h1>
          <p>
            Please continue the process by clicking the link in the email we've
            sent to ${email}.
          </p>
          <br />
          <p>
            The message may take a few seconds to arrive but the link will be
            valid for ten minutes. If it's not in your inbox, check your spam
            folder.
          </p>
        `
    } catch (error) {
      let status = "Error"
      let message = "Something went wrong"
      if (error instanceof Response) {
        status = error.status + ""
        message = await error.json()
      }
      let errorMessage = document.createElement("div")
      errorMessage.classList.add("error-message")
      errorMessage.innerText = `${status}: ${message}`
      form.appendChild(errorMessage)
      button.disabled = true
      setTimeout(() => {
        form.removeChild(errorMessage)
        button.disabled = false
      }, 3000)
      button.innerText = buttonText
    } finally {
      button.ariaBusy = null
    }
  })
}

let authRoutes = ["forgot-password", "login", "register"] as const

type AuthRoute = (typeof authRoutes)[number]

export function isAuthRoute(route: string): route is AuthRoute {
  return authRoutes.includes(route as AuthRoute)
}
