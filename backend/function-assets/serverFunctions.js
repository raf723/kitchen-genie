import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts'
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'


// DB connection
const client = new Client(Deno.env.get('PG_URL'))
await client.connect()

// Envirionment setup
const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

//------------------------- Library of Useful Functions -------------------------//
//Authentication functions
const universalSalt = "$2a$08$a1eVke4/bxYSkIJhBT6rcu"
export async function encryptPassword(password, salt="") {
  if (!salt) { salt = await bcrypt.genSalt(8)}
  password = await bcrypt.hash(password + universalSalt + salt)
  return { password, salt }
}

export async function isRegisteredUser(email, password) {
  if (email && password) {
    const userWithEmail = await getUser({ email })
    if (userWithEmail) {
      return await bcrypt.compare(password + universalSalt + userWithEmail.salt,
          userWithEmail.encrypted_password)
      } else {return false }
  } else {
      return false
  }
} 

//Query functions
//Function to get a user from the users table in database
export async function getUser({email: undefined, userID: undefined, username: undefined}) {
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

export const serverFunctions = { addUser, getUser, isRegisteredUser, encryptPassword }

export default serverFunctions

await client.end()