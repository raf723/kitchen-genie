import { Application } from 'https://deno.land/x/abc@v1.3.1/mod.ts'
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import { cors } from 'https://deno.land/x/abc@v1.3.1/middleware/cors.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts'
import { v4 } from 'https://deno.land/std/uuid/mod.ts'

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
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

app
    .use(cors({ allowHeaders: headersWhiteList, allowCredentials: true, allowOrigins: [Deno.env.get("ALLOWED_ORIGINS")] }))
    .start({ port: PORT })