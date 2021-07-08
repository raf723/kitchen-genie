/* eslint-disable default-case */

// Server imports
import { Application } from 'https://deno.land/x/abc@v1.3.1/mod.ts'
import { cors } from 'https://deno.land/x/abc@v1.3.1/middleware/cors.ts'

// Security imports
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts'
import { v4 } from 'https://deno.land/std/uuid/mod.ts'

// Database imports
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'

// Envirionment setup
const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

// DB connection
const client = new Client(Deno.env.get('PG_URL'))
await client.connect()

// Server functions
import { addUser, getUser, isRegisteredUser, encryptPassword } from './function-assets/serverFunctions.js' 
import verify from './function-assets/verify.js'

const app = new Application()
const PORT = Number(Deno.env.get("PORT"))
const headersWhiteList = [
  'Authorization',
  'Content-Type',
  'Accept',
  'Origin',
  'User-Agent'
]

// Global variables
let authenticated = false
let userID = ''

app
  .use(cors({ allowHeaders: headersWhiteList, allowCredentials: true, allowOrigins: [Deno.env.get("ALLOWED_ORIGINS")] }))

  //------------------------- Authenticate -------------------------//
  .get('/authenticate', async (server) => {
    // Get session cookie to authenticate current user
    const serverCookie = server.cookies.sessionId

    // Search sessions table to validate whether session cookie exists
    const [ dbCookie ] = (await client.queryObject(`SELECT * FROM sessions WHERE uuid = $1`, serverCookie )).rows

    // Set global variables depending on validation of session cookie
    if (dbCookie !== undefined && serverCookie === dbCookie.uuid) {
      authenticated = true
      userID = dbCookie.user_id
    } else {
      authenticated = false
      userID = ''
    }

    // Server response
    await server.json( authenticated )
  })



  //------------------------- Login handler -------------------------//
  // .post('/login', async (server) => {
  //   // Get email and password from front-end
  //   const { email, password, remember } = await server.body

  //   // Dynamic block-scope variable to pass to front-end via server response
  //   let errorMessage = ''

  //   // Look up user via email
  //   const [ user ] = (await client.queryObject('SELECT * FROM users WHERE email = $1', email )).rows

  //   // Validation
  //   switch (true) {
  //     case email.length === 0:
  //       errorMessage = 'Please enter your email!'
  //       break
  //     case password.length === 0:
  //       errorMessage = 'Please enter your password!'
  //       break
  //     case user === undefined:
  //       errorMessage = 'No account associated with this email!'
  //       break
  //     default:
  //       if (!isRegisteredUser(email)) errorMessage = 'Incorrect password. Please try again.'
  //       break
  //   }

  //   // Login authenticated
  //   if (errorMessage === '') {
  //     // Set global variables
  //     authenticated = true
  //     userID = user.id
      
  //     // Set cookie if user checked 'Remember me'
  //     if (remember) {
  //       // Generate uuid for cookie
  //       const sessionId = v4.generate()

  //       // Store uuid in sessions
  //       client.queryObject("INSERT INTO sessions (uuid, user_id, created_at) VALUES ($1, $2, NOW())", sessionId, userID ).rows
  //       server.setCookie({
  //         name: "sessionId",
  //         value: sessionId,
  //         expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  //         path: "/"
  //       })
  //     }
  //   } else {
  //     // Reset global variable, userID
  //     userID = ''
  //   }

  //   // Server response
  //   await server.json({ errorMessage })
  // })

.post('/login', async (server) => {
  let { email, password } = await server.body
  const authenticated = await isRegisteredUser(email, password)

  if (authenticated) {
    const user = await getUser({ email })
    const sessionId = v4.generate()
    await client.queryObject(`INSERT INTO sessions (uuid, user_id, created_at, expiry_date)
                    VALUES ($1, $2, NOW(), NOW() + interval '7 days');`, sessionId, user.id)
    server.setCookie({
      name: "sessionID",
      value: sessionID,
      expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      path: "/"
    })
    const currentUser = { name: user.username, id: user.id }
    server.json({ response: "success", currentUser })
  } else {
    server.json({ response: "bad credentials", currentUser: null})
  }

})

  //------------------------- Registration Handler -------------------------//
  .post('/register', async (server) => {
    let { email, password, username } = await server.body

    if(verify.isEmailValid(email) && verify.isPasswordValid(password) && verify.isUsernameValid(username, true)) {
        username = username.trim()
        email = email.trim()
        if (await getUser({ email })) {
            //Error:Already a user
            server.json({ response:`already registered` })
        } else {
            //All good
            await addUser(email, password, username)
            server.json({ response:`success`})
        }
    } else {
        //Error:Invalid email, username or password
        server.json({  response: `bad credentials` })
    }
  })



  //------------------------- Get username -------------------------//
  .get('/checkname/:username', async (server) => {
    const username = server.params.username.trim()
    const nameExists = !! (await getUser({ username })) //getUser retrieves a user given an username, email, or id. If unable to find user with matching credentials, it returns null.
    await server.json({ nameExists: nameExists })
  })



  //------------------------- Get email -------------------------//
  .get('/checkemail/:email', async (server) => {
    const email = server.params.email.trim()
    if (verify.isEmailValid(email)) {
      const emailExists = !! (await getUser({ email }))
      await server.json({ emailExists: emailExists })
    } else {
      await server.json({emailExists: false})
    }
  })



  //------------------------- Start server -------------------------//
  .start({ port: PORT })
console.log(`Server running on http://localhost:${PORT}`)
