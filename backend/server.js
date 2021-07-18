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
      server.json({ response: true, currentUser })
    } else {
      server.json({ response: false })
    }
  })



  //--------------------- Sessions handler -----------------------------------//
  .get('/sessions/:sessionId', async (server) => {
    const { sessionId } = server.params
    const currentUser = await getCurrentUser(sessionId)
    if (currentUser) server.json({ username: currentUser.username, id: currentUser.id }) // Respond with whose session it is
    else server.json(null)
  })



  //------------------------- Registration handler -------------------------//
  .post('/register', async (server) => {
    let { email, password, username } = await server.body

    if (verify.isEmailValid(email) && verify.isPasswordValid(password) && verify.isUsernameValid(username, true)) {
        username = username.trim()
        email = email.trim()

        if (await getUser({ email })) {
          server.json({ response:`already registered` }) // User already registered
        } else {
          await addUser(email, password, username)
          server.json({ response:`success`})
        }

    } else {
        server.json({  response: `bad credentials` }) // Invalid email, username or password
    }
  })



  //------------------------- Get username -------------------------//
  .get('/checkname/:username', async (server) => {
    const username = server.params.username.trim()
    const nameExists = !! (await getUser({ username })) // getUser() retrieves a registered user (using username, email, or id), else returns null.
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



  //------------------------- Get single recipe rating ---------------------//
  .get('/recipe/averagerating/:id', async (server) => {
    const { id } = server.params

    // Query for average rating for a recipe
    const averageRatingQuery = `SELECT COUNT(*)::integer AS total_ratings, ROUND(AVG(rating), 2)::float AS value 
      FROM recipe_rating
      WHERE recipe_id = $1;`

    // Get average rating for a particular recipe using recipeID
    const [ averageRating ] = (await client.queryObject(averageRatingQuery, id)).rows


    if (Number.isNaN(Number.parseFloat(averageRating.value))){
      //Sets value to zero if no one has voted. 
      averageRating.value = 0
    }

    server.json(averageRating)
  })



  //------------------------- Get multiple recipe ratings ---------------------//
  .get('/averagerating/bulk/:recipeIdsString', async (server) => {
    const  { recipeIdsString } = await server.params

    // Make an array from the string of comma-delimited ids (e.g. '11645,78981,3394' --> [11645,78981,3394])
    const recipeIds = recipeIdsString.split(',') || ['_']

    // e.g. [11645,78981,3394] --> "$1, $2, $3"
    const queryTemplate = recipeIds.reduce((accumulator, _recipeId, i) =>  accumulator + `$${i + 1}, `, "" ).slice(0, -2)

    // Query for average rating for a recipe
    const averageRatingQuery = `SELECT recipe_id, ROUND(AVG(rating), 2)::float AS value
      FROM recipe_rating
      WHERE recipe_id IN (${queryTemplate})
      GROUP BY recipe_id;`

    // Get average rating for multiple recipes (recipeIDs array)
    const averageRatingsArray = (await client.queryObject(averageRatingQuery, ...recipeIds)).rows

    // Make an object with recipe_id as keys and ratings as values for efficency and convenience
    const averageRatings = averageRatingsArray.reduce((accumulator, rating) => { 
      accumulator[rating.recipe_id] = !rating.value ? 0 : Number.parseFloat(rating.value)
      return accumulator }, {})
    
    server.json({ response: "success", averageRatings }) 
  })



  //------------------------- Get personal recipe rating ---------------------//
  .get('/recipe/personalrating/:recipeId/:sessionId', async(server) => {
    const { sessionId, recipeId } = server.params
    const currentUser = await getCurrentUser(sessionId)

    // Get current user's rating for a particular recipe
    const userRecipeRating = `SELECT rating, recipe_id
      FROM recipe_rating
      WHERE recipe_id = $1
      AND user_id = $2`
    const [recipe] = (await client.queryObject(userRecipeRating, recipeId, currentUser.id)).rows

    if (currentUser) {
      if (recipe && recipe.rating) server.json({ response:'success', recipe }) // Successful rating
      else server.json({response:'success', recipe: { rating:  0, recipe_id: recipeId }}) // Unsuccessful rating
    } else await server.json({ response: 'unauthorized', recipe: {} }) // Bad Credentials
  })

  

  //--------------------------- Insert rating ------------------------//
  .post('/recipe/rating', async (server) => {
    const { sessionId } = server.cookies
    const currentUser = await getCurrentUser(sessionId)

    if (currentUser) {
      const { rating, recipeId } = await server.body

      // Is sequential id numbering a security risk
      const user = await getCurrentUser(server.cookies.sessionId)

      // Delete instances with same recipe id and user.id
      const deleteOldRating = `DELETE FROM recipe_rating
        WHERE user_id = $1
        AND recipe_id = $2;`
      await client.queryObject(deleteOldRating, user.id, recipeId)

      const insertNewRating = `INSERT INTO recipe_rating (rating, created_at, updated_at, recipe_id, user_id)
        VALUES ($1, NOW(), NOW(), $2, $3)
        RETURNING rating;`
      const [ ratingResponse ] = (await client.queryObject(insertNewRating, rating, recipeId, user.id)).rows

      // Return user's rating
      server.json({ rating: ratingResponse.rating })
    } else {
      // User is unauthorized to rate
      server.json({message: 'You need to be a registered user to rate.'})
    }
  })



  //------------------------- Get saved recipes -------------------------//
  .get('/myrecipes', async (server) => {
    const sessionId = server.cookies.sessionId
    const currentUser = await getCurrentUser(sessionId)
    if (currentUser) {
      const savedRecipeIds = (await client.queryArray(`SELECT recipe_id FROM saved_recipes
        WHERE user_id = $1
        AND active = 't'
        ORDER BY created_at DESC;`, currentUser.id)).rows 

      if (savedRecipeIds.length !== 0) {
        // Convert savedRecipeIDs array to usable string to pass as a parameter when making a bulk fetch from Spoonacular
        const recipeString = savedRecipeIds.reduce((accumulator, [recipe], i) => accumulator + recipe + (i === savedRecipeIds.length - 1 ? "" : ","), "") 
        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeString}&apiKey=${Deno.env.get('SPOONACULAR_API_KEY')}`
        const spoonacularApiResponse = await fetch(spoonacularEndpoint)
        const recipes = await spoonacularApiResponse.json()

        // If failure (spoonacular side) return 'service down', else return a list of saved recipes (if any)
        if (recipes.status === "failure") await server.json({ response: 'service down', recipes: [], loggedInUser: { username: currentUser.username, id: currentUser.id } })
        else await server.json({ response: 'success', recipes, loggedInUser: { username: currentUser.username, id: currentUser.id } })

      } else {
        // User did not save any recipe
        await server.json({ response: 'success', recipes: [], loggedInUser: { username: currentUser.username, id: currentUser.id } })
      }
    } else {
      // Bad Credentials
      await server.json({ response: 'unauthorized' })
    }

  })



  //------------------------- Post saved recipe -------------------------//
  .post('/save/:recipeId/:action', async (server) => {
    const { sessionId } = server.cookies
    const currentUser = await getCurrentUser(sessionId)

    if (currentUser) {
      const { recipeId, action } = server.params

      // Set previously favourited recipe to 'f' (soft-deletion)
      const toggleActiveSavesFalse = `UPDATE saved_recipes 
        SET active = 'f', updated_at = NOW()
        WHERE user_id = $1
        AND recipe_id = $2
        AND active = 't';`
      await client.queryObject(`${toggleActiveSavesFalse}`, currentUser.id, recipeId)

      // Insert favourited recipe into DB
      const createActiveSave = `INSERT INTO saved_recipes(user_id, recipe_id, active, created_at, updated_at)
        VALUES ($1, $2, 't', NOW(), NOW());`
      if (action === 'save') await client.queryObject(`${ createActiveSave }`, currentUser.id, recipeId)

      await server.json({ response: 'success' })
    } else {
      await server.json({ response: 'unauthorized' })
    }
  })



  //-------------------------- Get list of recipes -------------------//
  .get('/myrecipes/id-only', async (server) => {
    const sessionId = server.cookies.sessionId
    const currentUser = await getCurrentUser(sessionId)

    if (currentUser) {
      const queryResults = (await client.queryArray(`SELECT recipe_id
        FROM saved_recipes 
        WHERE user_id = $1
        AND active = 't';`, currentUser.id)).rows
      const savedRecipeIds = queryResults.reduce((accumulator, id) => accumulator.concat(id), []) // Technicality: removes nesting from results

      // All good: Return a list of saved recipeIds if any
      await server.json({ response: 'success', savedRecipeIds, loggedInUser: { username: currentUser.username, id: currentUser.id }})
    
    } else {
      // Bad Credentials
      await server.json({ response: 'unauthorized' })
    }
  })



  //-------------------------- Get list of comments -------------------//
  .get('/comments/:recipeId', async (server) => {
    const { recipeId } = await server.params

    const queryResults = (await client.queryObject(`SELECT comment, recipe_comments.id, recipe_id, user_id, recipe_comments.created_at, username 
      FROM recipe_comments 
      JOIN users ON recipe_comments.user_id = users.id
      WHERE recipe_id = $1
      ORDER BY created_at DESC;`, recipeId))

    await server.json({response: 'success', comments: queryResults.rows })
  })



  //-------------------------- Post a comment -------------------//
  .post('/comment/:recipeId', async (server) => {
    const sessionId = server.cookies.sessionId
    const currentUser = await getCurrentUser(sessionId)
    const { recipeId } = server.params
    const { comment } = await server.body


    if (currentUser) {
      const [ outCome ] =  (await client.queryObject(`INSERT INTO recipe_comments(comment, recipe_id, user_id, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING created_at, comment;`, comment, recipeId, currentUser.id)).rows

      if (outCome) await server.json({ response: 'success', newComment: outCome.comment, createdAt: outCome.created_at }) // All good
      else await server.json({ response: 'failure' }) // Error processing the query

    } else {
      // Bad Credentials
      await server.json({ response: 'unauthorized' })
    }

  })

  //------------------------- Start server -------------------------//
  .start({ port: PORT })
console.log(`Server running on http://localhost:${PORT}`)
