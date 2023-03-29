# Complete NodeJS Developer in 2023 Bootcamp

## Planets Project

**All sets of commands below assume you start from the root of the project**

### Run Production Build
*This option runs both the client and server on the same terminal instance.*
`
npm run install
npm run deploy
`

### Run Server Individually
`
cd server
npm run start
`

By default, the server runs on port 8000
*Connections from the client depend on this port. Changing this value means having to change the port in [client/src/hooks/requests.js](client/src/hooks/requests.js)*

You can access the backend API at the /launches and /planets route.
It was built with handling the client-side in mind, so any other routes will not work.

### Run Client Individually
`
cd client
npm run start
`

By default, the server runs on port 3000
