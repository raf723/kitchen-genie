import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts";

// Environment setup
const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'

// Attain path to env file
config({ path: `./.env.${DENO_ENV}`, export: true })

// Set up new client to dev psql database.
const client = new Client(Deno.env.get("PG_URL"))

// Connect to db.
await client.connect()

// Drop old tables
await client.queryObject(`DROP TABLE IF EXISTS sessions;`)
await client.queryObject(`DROP TABLE IF EXISTS rating;`)
await client.queryObject(`DROP TABLE IF EXISTS saved_recipes;`)
await client.queryObject(`DROP TABLE IF EXISTS recipe_comment_votes;`)
await client.queryObject(`DROP TABLE IF EXISTS recipe_comments;`)
await client.queryObject(`DROP TABLE IF EXISTS users;`)

// Create user table.
await client.queryObject(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    encrypted_password TEXT UNIQUE NOT NULL, 
    salt TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
  );`
)

// Create sessions table
await client.queryObject(`
  CREATE TABLE IF NOT EXISTS sessions (
    uuid TEXT PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`
)

// Create rating table
await client.queryObject(`
  CREATE TABLE IF NOT EXISTS recipe_rating (
    id SERIAL PRIMARY KEY,
    rating INT NOT NULL,
    CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    recipe_id INTEGER NOT NULL,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );`
)

// Create saved recipes table
await client.queryObject(`
  CREATE TABLE IF NOT EXISTS saved_recipes (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL,
    recipe_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );`
)

// Create recipe comments table
await client.queryObject(`
  CREATE TABLE IF NOT EXISTS recipe_comments (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    comment TEXT NOT NULL,
    recipe_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );`
)

// Create recipe comment votes
await client.queryObject(`
  CREATE TABLE IF NOT EXISTS recipe_comment_votes (
    id SERIAL PRIMARY KEY,
    direction TEXT NOT NULL DEFAULT 'up',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    user_id INTEGER,
    comment_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(comment_id) REFERENCES recipe_comments(id)
  );`
)
