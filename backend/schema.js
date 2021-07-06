const PG_URL = 'postgres://xwwfuwxv:XeEM9GGiu8_guphTKafAevWvgtF5u8IY@rogue.db.elephantsql.com/xwwfuwxv'

import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(PG_URL)

await client.connect()



