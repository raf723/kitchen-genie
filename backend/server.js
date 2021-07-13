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
import { addUser, getUser, isRegisteredUser, getCurrentUser } from './function-assets/serverFunctions.js' 
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

app
  .use(cors({ allowHeaders: headersWhiteList, allowCredentials: true, allowOrigins: [Deno.env.get("ALLOWED_ORIGINS")] }))

//------------------------- Login handler -------------------------//

.post('/login', async (server) => {
  let { email, password, remember } = await server.body
  const authenticated = await isRegisteredUser(email, password)

  if (authenticated) {
    const user = await getUser({ email })
    const sessionId = v4.generate()
    const sessionLifespan = remember ? '7 days' : '1 day'
    await client.queryObject(`INSERT INTO sessions (uuid, user_id, created_at, expiry_date)
                    VALUES ($1, $2, NOW(), NOW() + interval '${sessionLifespan}');`, sessionId, user.id)
    server.setCookie({
      name: "sessionId",
      value: sessionId,
      expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      path: "/"
    })
    const currentUser = { name: user.username, id: user.id }
    server.json({ response: "success", currentUser })
  } else {
    server.json({ response: "bad credentials", currentUser: null})
  }

})

//--------------------- Sessions handler -----------------------------------// to revive sessions
.get('/sessions/:sessionId', async (server) => {
  const { sessionId } = server.params
  const currentUser = await getCurrentUser(sessionId)
  if (currentUser) {
    server.json({ username: currentUser.username, id: currentUser.id }) //respond with whose session it is
  } else {
    server.json(null)
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

//------------------------- Get Saved Recipes -------------------------//
  .get('/myrecipes', async (server) => {
    const sessionId = server.cookies.sessionId
    const currentUser = await getCurrentUser(sessionId)
    if (currentUser) {
      const recipes = (await client.queryArray(`
        SELECT recipe FROM saved_recipes 
        WHERE user_id = $1 AND active = 't'
        ORDER BY created_at DESC;`, currentUser.id)).rows 

      //All good: Return a list of saved recipes if any
      await server.json({ response: 'success', recipes, loggedInUser: { username: currentUser.username, id: currentUser.id } })
    } else {
      //Bad Credentials
      await server.json({ response: 'unauthorized' })
    }

  })

  //------------------------- Post Saved Recipe -------------------------//
  .post('/save/:action', async (server) => {
    const { sessionId } = server.cookies
    const currentUser = await getCurrentUser(sessionId)

    if (currentUser) {
      const { action } = server.params
      const recipe = await server.body

      const toggleActiveSavesFalse = ` 
        UPDATE saved_recipes 
        SET active = 'f', updated_at = NOW()
        WHERE user_id = $1 AND recipe = $2 AND active = 't';
      `
      const createActiveSave = ` 
        INSERT INTO saved_recipes(user_id, recipe, active, created_at, updated_at)
        VALUES ($1, $2, 't', NOW(), NOW());
      `
      await client.queryObject(`${toggleActiveSavesFalse}`, currentUser.id, recipe) 
      if (action === 'save') {
        await client.queryObject(`${ createActiveSave }`, currentUser.id, recipe)
      }
      //Recipe successfully saved
      await server.json({ response: 'success' })
    } else {
      //Must login to save recipes
      await server.json({ response: 'unauthorized' })
    }
  })
  
//------------------------- Start server -------------------------//
  .start({ port: PORT })
console.log(`Server running on http://localhost:${PORT}`)
