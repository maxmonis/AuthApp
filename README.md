# AuthApp

[TypeScript](https://www.typescriptlang.org/) monorepo with
[Express](https://expressjs.com/) backend and [React](https://react.dev/)
frontend. Allows creation and authentication of users stored in a
[MongoDB](https://www.mongodb.com/) database. Uses
[nodemailer](https://nodemailer.com/) and
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) for email
verification and to facilitate updates to password.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/): runtime environment - required version
  indicated in [.nvmrc](/.nvmrc)
- [npm](https://www.npmjs.com/): package manager - comes with the Node.js
  installation
- [nvm](https://github.com/nvm-sh/nvm): version manager - ensures correct
  version of Node.js used

Data will be managed by MongoDB, so create a database on their site. It's free
to use and easy to set up.

You'll also need a gmail account and a password which authorizes sending
automated emails from it (this is different from the password used to log into
the account, and is simple to obtain by following Google's instructions).

## Installation

Clone the repository onto your local machine and navigate to the project
directory:

```
git clone https://github.com/maxmonis/AuthApp.git
```

```
cd AuthApp
```

Install the dependencies of both the server and client:

```
npm run setup
```

Create a gitignored file called `.env` at the root of the project:

```
touch .env
```

Now add the following environment variables therein:

- `BASE_URL`: the address at which the app is hosted (`http://localhost:3000` in
  development)
- `JWT_SECRET`: the secret string of your choosing which jsonwebtoken will use
  for encryption and decryption
- `MONGO_URI`: the URI of the database you will use in MongoDB
- `NODEMAILER_EMAIL`: the gmail address from which automated emails will be sent
  by nodemailer
- `NODEMAILER_PASSWORD`: the password which authorizes sending automated emails
  from said address

## Configuration

Before starting the application in development, run the following command to
ensure you're using the correct version of Node.js:

```
nvm use
```

Note that this command only needs to be run at the start of a session, not each
time you restart the application.

You may be prompted to install the required Node.js version if you have not
already.

## Development

Simultaneously start the client application while using
[Nodemon](https://www.npmjs.com/package/nodemon) to run the server and
automatically restart it when changes are detected:

```
npm run dev
```

This will start the server on `http://localhost:5000` while concurrently
starting the client on `http://localhost:3000`.

If you want to work on the backend without the frontend, run:

```
npm run server
```

This will start the server on `http://localhost:5000` and update whenever
changes are detected.

Conversely, if you want to work on the client without the server, you can run
the application using a [Mock Service Worker](https://mswjs.io/) mock backend:

```
npm run dev:msw
```

This will start the app in watch mode on `http://localhost:3000` and facilitates
development even without being connected to the internet.

Note that this relies on the gitignored file `/app/public/mockServiceWorker.js`.
It should have been created automatically during installation but if not you can
add it now:

```
cd app && npx msw init public && cd ..
```

This is a one time thing, once the file is created the browser mocking will work
in perpetuity.

## Testing

Unit tests rely on the same Mock Service Worker handlers and can be run with:

```
npm test
```

For a detailed coverage report run:

```
npm run coverage
```

As of `v0.1.0` 100% coverage has been achieved:

<img width="593" alt="Screen Shot 2024-02-03 at 12 50 51 PM" src="https://github.com/maxmonis/AuthApp/assets/51540371/39f6970e-d31d-403b-b81f-4cc68ce7511a">

There are currently only tests for the client side, as I'm not a backend
developer.

## Deployment

The following commands build the TypeScript files and start the server:

```
npm run build
```

```
npm start
```

## Project Structure

The basic structure is as follows:

- `api`: Express server
  - `server.ts`: configures and starts the server
- `dist`: gitignored output directory for compiled backend code
- `app`: React application
  - `build`: gitignored output directory for compiled frontend code

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE)
file for details.
