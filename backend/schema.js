
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts";

//Get deno environment 
const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

await client.queryObject(
`CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    instructions TEXT UNIQUE NOT NULL,
    ingredients TEXT NOT NULL,
    tags TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
    );`
)

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

await client.queryObject(`
    CREATE TABLE IF NOT EXISTS sessions (
        uuid TEXT PRIMARY KEY,
        created_at TIMESTAMP NOT NULL,
        expiry_date TIMESTAMP NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );`
)

await client.queryObject(`
    CREATE TABLE IF NOT EXISTS rating (
        id SERIAL PRIMARY KEY,
        rating INT NOT NULL,
        CHECK (rating BETWEEN 1 AND 5),
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        user_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );`
)


await client.queryObject(`
    CREATE TABLE IF NOT EXISTS saved_recipes (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        active BOOLEAN NOT NULL,
        recipe_id INTEGER,
        FOREIGN KEY(recipe_id) REFERENCES recipes(id)
    );`
)

await client.queryObject(`
    CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        comment TEXT NOT NULL,
        recipe_id INTEGER,
        FOREIGN KEY(recipe_id) REFERENCES recipes(id)
    );`
)

await client.queryObject(`
        CREATE TABLE IF NOT EXISTS comment_votes (
            id SERIAL PRIMARY KEY,
            direction TEXT NOT NULL DEFAULT 'up',
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL,
            user_id INTEGER,
            comment_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(comment_id) REFERENCES comments(id)
        );
    `
)