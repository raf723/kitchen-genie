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
    const sessionLifespan = remember ? '7 days' : '1 hour'
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

  //------------------------- Get Recipe Rating ---------------------//

  .get('/recipe/averagerating/:id', async (server) => {

    const { id } = server.params

    const averageRatingQuery = `SELECT ROUND(AVG(rating), 2)::float AS value FROM recipe_rating WHERE recipe_id = $1;`

    const [ averageRating ] = (await client.queryObject(averageRatingQuery, id)).rows

    if(Number.isNaN(Number.parseFloat(averageRating.value))){
      averageRating.value = 0
    }

    server.json(averageRating)
  
  })

  //------------------------- Get Personal Recipe Rating ---------------------//

  .get('/recipe/personalrating/:recipeId/:sessionId', async(server) => {

    const { sessionId, recipeId } = server.params

    const currentUser = await getCurrentUser(sessionId)

    const userRecipeRating = `SELECT rating, recipe_id FROM recipe_rating WHERE recipe_id = $1 AND user_id = $2`

    const recipe = (await client.queryObject(userRecipeRating, recipeId, currentUser.id)).rows

    console.log( recipe )

    if(recipe.length === 0){
      server.json({ rating:  0, recipe_id: recipeId})
    }else{
      server.json(recipe)
    }
  })


  //--------------------------- Post Rating ------------------------//

  .post('/recipe/rating', async (server) => {

    if(!server.cookies.sessionId){
      server.json({message: 'You need to be a registered user to rate.'})
    }

    const { rating, recipeId } = await server.body

    console.log(rating)

    //Is sequential id numbering a security risk
    const user = await getCurrentUser(server.cookies.sessionId)
    //Delete instances with same recipe id and user.id
    const deleteOldRating = `
      DELETE FROM recipe_rating
        WHERE user_id = $1 AND recipe_id = $2;`

    const insertNewRating = `INSERT INTO recipe_rating 
        (rating, created_at, updated_at, recipe_id, user_id)
      VALUES 
        ($1, NOW(), NOW(), $2, $3)
        RETURNING rating;`

      await client.queryObject(deleteOldRating, user.id, recipeId)
      
      const [ ratingResponse ] = (await client.queryObject(insertNewRating, rating, recipeId, user.id)).rows

    server.json({ rating: ratingResponse.rating })

  })



  //------------------------- Start server -------------------------//
  .start({ port: PORT })
console.log(`Server running on http://localhost:${PORT}`)
