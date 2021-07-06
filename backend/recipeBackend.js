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



    //------------------------- Login handler -------------------------//
  .post('/login', async (server) => {
    // Get email and password from front-end
    const { email, password } = await server.body

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
      
      // Set cookie
      server.setCookie({
        name: "sessionId",
        value: sessionId,
        expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        path: "/"
      })
    } else {
      // Reset global variable, userID
      userID = ''
    }

    // Server response
    await server.json({ errorMessage })
  })



  //------------------------- Start server -------------------------//
  .start({ port: PORT })
console.log(`Server running on http://localhost:${PORT}`)
