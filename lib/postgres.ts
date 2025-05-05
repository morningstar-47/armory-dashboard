import { Pool, type PoolClient } from "pg"
import { createHash } from "crypto"

// Singleton pattern for PostgreSQL connection
let pool: Pool | null = null

// Connection configuration
const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    })
  }
  return pool
}

// Function to execute queries
export async function query<T>(text: string, params: any[] = []): Promise<T[]> {
  const pool = getPool()
  const start = Date.now()

  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res.rows as T[]
  } catch (error) {
    console.error("Error executing query", { text, error })
    throw error
  }
}

// Function to execute transactions
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Transaction error", error)
    throw error
  } finally {
    client.release()
  }
}

// Function to hash a password
export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

// Function to close the connection (useful for tests)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}
