import axios from "axios"
import React from "react"
import {Link, Navigate, useNavigate, useParams} from "react-router-dom"
import {AccountLayout} from "src/auth/components/AccountLayout"
import {Button} from "src/components/cta/Button"
import {Input} from "src/components/form/Input"
import {parseError} from "src/utils/parsers"
import {
  hasChars,
  isAlphanumeric,
  isEmail,
  isPassword,
} from "src/utils/validators"
import {useAuth} from "../hooks/useAuth"
import {useUpdateAuth} from "../hooks/useUpdateAuth"
import {AccountRoute, TokenRes} from "../utils/authTypes"

export function AccountApp({route}: {route: AccountRoute}) {
  const {data: user, isLoading: authenticating} = useAuth()
  const updateAuth = useUpdateAuth()
  const navigate = useNavigate()
  const params = useParams<{token?: string}>()
  const fields =
    route === "register"
      ? (["email", "password", "password2"] as const)
      : route === "login"
        ? (["email", "password"] as const)
        : route === "update-password"
          ? (["password", "password2"] as const)
          : (["email"] as const)
  const state: Partial<Record<(typeof fields)[number], string>> = {}
  for (const field of fields) state[field] = ""
  const [values, setValues] = React.useState(state)
  const {email, password, password2} = values
  const [errors, setErrors] = React.useState(state)
  const [error, setError] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [invited, setInvited] = React.useState(false)
  if (authenticating) return <></>
  if (user) return <Navigate replace to="/" />
  return invited ? (
    <AccountLayout title="Email Sent">
      <p>
        To{" "}
        {route === "register"
          ? "complete the registration process"
          : "finish resetting your password"}
        , click the link in the message we've sent to{" "}
        <span className="break-words font-bold">{email}</span>.
      </p>
      <p>
        It may take a few seconds to arrive, but the link will be valid for ten
        minutes. Check your spam folder if you can't find it in your inbox.
      </p>
    </AccountLayout>
  ) : (
    <AccountLayout
      title={
        route === "register"
          ? "Create Account"
          : route === "login"
            ? "Access Account"
            : "Reset Password"
      }
    >
      <form
        className="flex flex-col gap-3"
        noValidate
        onSubmit={async e => {
          e.preventDefault()
          if (error || submitting) return
          const errors: typeof state = {}
          if ("email" in state)
            if (!hasChars(email)) errors.email = "Email is required"
            else if (!isEmail(email)) errors.email = "Invalid email"
          if ("password" in state)
            if (!hasChars(password)) errors.password = "Password is required"
            else if (!isAlphanumeric(password))
              errors.password = "Password can only contain letters and numbers"
            else if (!isPassword(password))
              errors.password =
                "Password must contain at least eight characters including a lowercase letter, an uppercase letter, and a number"
          if ("password2" in state)
            if (!hasChars(password2))
              errors.password2 = "Password confirmation is required"
            else if (password2 !== password)
              errors.password2 = "Passwords must match"
          if (Object.keys(errors).length) return setErrors(errors)
          setSubmitting(true)
          try {
            switch (route) {
              case "login":
                const {
                  data: {token},
                } = await axios.post<TokenRes>("/api/user/login", values)
                await updateAuth(token)
                return navigate("/", {replace: true})
              case "register":
                await axios.post("/api/user/create", values)
                return setInvited(true)
              case "forgot-password":
                await axios.post("/api/user/update-password", values)
                return setInvited(true)
              case "update-password":
                const res = await axios.patch<TokenRes>(
                  "/api/user/update-password",
                  {...values, token: params.token},
                )
                await updateAuth(res.data.token)
                return navigate("/", {replace: true})
            }
          } catch (error) {
            const {message, status} = parseError(error)
            setError(
              (status ? `${status}: ` : "") +
                (message || "An unexpected error occurred"),
            )
            setTimeout(() => setError(""), 3000)
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {error && (
          <div className="rounded-lg bg-red-600 px-4 py-2 text-slate-50">
            {error}
          </div>
        )}
        {fields.map((field, i) => (
          <Input
            autoFocus={i === 0}
            error={errors[field]}
            key={field}
            label={
              field === "password2"
                ? `Confirm ${route === "update-password" ? "New " : ""}Password`
                : route === "update-password"
                  ? "New Password"
                  : field[0].toUpperCase() + field.slice(1)
            }
            name={field}
            onBlur={() => setErrors(state)}
            onChange={e => {
              setErrors(state)
              setValues({...values, [field]: e.target.value.slice(0, 50)})
            }}
            type={field === "email" ? "email" : "password"}
            value={values[field]}
          />
        ))}
        <Button
          className="mb-1 mt-2"
          disabled={Boolean(error)}
          loading={submitting}
          text={
            route === "login"
              ? "Log In"
              : route === "register"
                ? "Sign Up"
                : route === "forgot-password"
                  ? "Send Link"
                  : "Save New Password"
          }
          type="submit"
        />
      </form>
      {route === "login" && (
        <div className="-mb-1">
          <Link
            className="text-blue-600 dark:text-blue-400"
            to="/forgot-password"
          >
            Forgot Password
          </Link>
        </div>
      )}
      {route === "update-password" ? (
        <div>
          <Link className="text-blue-600 dark:text-blue-400" to="/login">
            Return to Login
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap gap-x-1.5">
          <p className="whitespace-nowrap">
            {route === "register" ? "Already a member?" : "Need an account?"}
          </p>
          <Link
            className="text-blue-600 dark:text-blue-400"
            to={route === "register" ? "/login" : "/register"}
          >
            {route === "register" ? "Login" : "Register"}
          </Link>
        </div>
      )}
    </AccountLayout>
  )
}
