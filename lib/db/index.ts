import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const globalForDatabase = globalThis as typeof globalThis & {
  pushNotificationPool?: Pool
}

const pool = globalForDatabase.pushNotificationPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
})

if (process.env.NODE_ENV !== 'production') {
  globalForDatabase.pushNotificationPool = pool
}

export const db = drizzle(pool, { schema })
