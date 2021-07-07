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

import verify from './function-assets/verify'

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

//------------------------- Useful Functions -------------------------//
//Authentication functions
const universalSalt = "$2a$08$a1eVke4/bxYSkIJhBT6rcu"
async function encryptPassword(password, salt="") {
  if (!salt) { salt = await bcrypt.genSalt(8)}
  password = await bcrypt.hash(password + universalSalt + salt)
  return { password, salt }
}

async function isRegisteredUser(email, password) {
  if (email && password) {
    const userWithEmail = await getUser({ email })
    if (userWithEmail) {
      return await bcrypt.compare(password + universalSalt + userWithEmail.salt,
          userWithEmail.encrypted_password)
      }
  } else {
      return false
  }
} 

//Query functions
//Function to get a user from the users table in database
async function getUser({email: undefined, userID: undefined, username: undefined}) {
  if (userID !== undefined) {
    return (await client.queryObject(`SELECT * FROM users WHERE id = $1;`, userID)).rows[0] || null
  } else if (email !== undefined) {
    return (await client.queryObject(`SELECT * FROM users WHERE email = $1;`, email)).rows[0] || null
  } else if (username !== undefined) {
    return (await client.queryObject(`SELECT * FROM users WHERE name = $1;`, username)).rows[0] || null
  } else {
    return null 
  }
}

//Function to add a user to the users table of the database
export async function addUser(email, password, username) {
  try {
    const encryption = await encryptPassword(password)
    await client.queryObject(`INSERT INTO users (username, email, encrypted_password, salt, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW();`, username, email, encryption.password, encryption.salt)
      return true
  } catch(error) {
    return false 
  }
}

app
  .use(cors({ allowHeaders: headersWhiteList, allowCredentials: true, allowOrigins: [Deno.env.get("ALLOWED_ORIGINS")] }))

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

  //------------------------- Start server -------------------------//
  .start({ port: PORT })
console.log(`Server running on http://localhost:${PORT}`)
