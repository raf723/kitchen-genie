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
      const savedRecipeIds = (await client.queryArray(`
        SELECT recipe_id FROM saved_recipes 
        WHERE user_id = $1 AND active = 't'
        ORDER BY created_at DESC;`, currentUser.id)).rows 

      const recipeString = savedRecipeIds.reduce((accumulator, [recipe], i) => accumulator + recipe + (i === savedRecipeIds.length - 1 ? "" : ","), "") 

      const spoonacularEndpoint = `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeString}&apiKey=109411015c2f4df5942a3143fb7b3c36`
      const spoonacularApiResponse = await fetch(spoonacularEndpoint)
      const recipes = await spoonacularApiResponse.json()

      if (recipes.status === "failure") {
        //Problem with spoonacular
        await server.json({ response: 'service down', recipes: [], loggedInUser: { username: currentUser.username, id: currentUser.id } })
      } else {
        //All good: Return a list of saved recipes if any
        await server.json({ response: 'success', recipes, loggedInUser: { username: currentUser.username, id: currentUser.id } })
      } 
    } else {
      //Bad Credentials
      await server.json({ response: 'unauthorized' })
    }

  })

  //------------------------- Post Saved Recipe -------------------------//
  .post('/save/:recipeId/:action', async (server) => {
    const { sessionId } = server.cookies
    const currentUser = await getCurrentUser(sessionId)

    if (currentUser) {
      const { recipeId, action } = server.params

      const toggleActiveSavesFalse = ` 
        UPDATE saved_recipes 
        SET active = 'f', updated_at = NOW()
        WHERE user_id = $1 AND recipe_id = $2 AND active = 't';
      `
      const createActiveSave = ` 
        INSERT INTO saved_recipes(user_id, recipe_id, active, created_at, updated_at)
        VALUES ($1, $2, 't', NOW(), NOW());
      `
      await client.queryObject(`${toggleActiveSavesFalse}`, currentUser.id, recipeId) 
      if (action === 'save') {
        await client.queryObject(`${ createActiveSave }`, currentUser.id, recipeId)
      }

      await server.json({ response: 'success' })
    } else {
      await server.json({ response: 'unauthorized' })
    }
  })

  //-------------------------- Get List of Recipes -------------------//
  .get('/myrecipes/id-only', async (server) => {
    const sessionId = server.cookies.sessionId
    const currentUser = await getCurrentUser(sessionId)
    if (currentUser) {

      const queryResults = (await client.queryArray(`
        SELECT recipe_id FROM saved_recipes 
        WHERE user_id = $1 AND active = 't';`, currentUser.id)).rows
      const savedRecipeIds = queryResults.reduce((accumulator, id) => accumulator.concat(id), []) //Technicality: removes nesting from results

      //All good: Return a list of saved recipeIds if any
      await server.json({ response: 'success', savedRecipeIds, loggedInUser: { username: currentUser.username, id: currentUser.id }})
    } else {

      //Bad Credentials
      await server.json({ response: 'unauthorized' })
    }
  })


  //------------------------- Start server -------------------------//
  .start({ port: PORT })
console.log(`Server running on http://localhost:${PORT}`)
