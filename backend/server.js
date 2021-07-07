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

import {addUser, getUser, isRegisteredUser, encryptPassword} from './function-assets/serverFunctions.js' 
import verify from './function-assets/verify.js'

// Envirionment setup
const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

// DB connection
const client = new Client(Deno.env.get('PG_URL'))
await client.connect()

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



  //------------------------- Search handler -------------------------//
  .post('/search', async (server) => {
    // Get search query (array of ingredients or recipe name) from front-end
    const { ingredients } = await server.body

    // Server response
    await server.json({ response })
  })



  //------------------------- Login handler -------------------------//
  .post('/login', async (server) => {
    // Get email and password from front-end
    const { email, password, remember } = await server.body

    // Dynamic block-scope variable to pass to front-end via server response
    let errorMessage = ''

    // Look up user via email
    const [ user ] = (await client.queryObject('SELECT * FROM users WHERE email = $1', email )).rows

    // Validation
    switch (true) {
      case email.length === 0:
        errorMessage = 'Please enter your email!'
        break
      case password.length === 0:
        errorMessage = 'Please enter your password!'
        break
      case user === undefined:
        errorMessage = 'No account associated with this email!'
        break
      default:
        // Password encryption
        const [ salt ] = (await client.queryObject('SELECT salt FROM users WHERE email = $1', email )).rows
        const passwordEncrypted = await bcrypt.hash(password, salt.salt)

        // Get user's encrypted password
        const [ userPassword ] = (await client.queryObject('SELECT encrypted_password FROM users WHERE email = $1', email )).rows
        
        if (passwordEncrypted !== userPassword.encrypted_password) errorMessage = 'Incorrect password. Please try again.'
        break
    }

    // Login authenticated
    if (errorMessage === '') {
      // Generate uuid for cookie
      const sessionId = v4.generate()

      // Set global variables
      authenticated = true
      userID = user.id

      // Store uuid in sessions
      client.queryObject("INSERT INTO sessions (uuid, user_id, created_at) VALUES ($1, $2, NOW())", sessionId, userID ).rows
      
      // Set cookie if user checked 'Remember me'
      if (remember) {
        server.setCookie({
          name: "sessionId",
          value: sessionId,
          expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
          path: "/"
        })
      }
    } else {
      // Reset global variable, userID
      userID = ''
    }

    // Server response
    await server.json({ errorMessage })
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

 //------------------------- Existence Check Handlers -------------------------//
   .get('/checkname/:name', async (server) => {
      const nameExists = !! (await client.queryObject('SELECT username FROM users WHERE username = $1;', server.params.name.trim())).rows.length
      await server.json({ nameExists: nameExists })
   })
   .get('/checkemail/:email', async (server) => {
      const email = server.params.email.trim()
      if (verify.isEmailValid(email)) {
        const emailExists = !!(await client.queryObject('SELECT email FROM users WHERE email = $1;', email)).rows.length
        await server.json({ emailExists: emailExists })
      } else {
        await server.json({emailExists: false})
      }
   })
  //------------------------- Start server -------------------------//
  .start({ port: PORT })
console.log(`Server running on http://localhost:${PORT}`)
