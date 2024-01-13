import {createTransport} from "./createTransport"

export async function sendEmail(email: {
  html: string
  subject: string
  to: string
}) {
  const transport = createTransport()
  /* awaiting these promises prevents an issue where the
  email would be sent in development but not production */
  await new Promise((resolve, reject) => {
    transport.verify((error, success) =>
      error ? reject(error) : resolve(success),
    )
  })
  await new Promise((resolve, reject) => {
    transport.sendMail(email, (error, info) =>
      error ? reject(error) : resolve(info),
    )
  })
  return true
}
