import pg from 'pg'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../../.env') })

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env file!')
  process.exit(1)
}

// Use Neon connection string with proper config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

// Test connection
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('✅ Neon Database connected successfully')
    console.log('📅 Database time:', result.rows[0].now)
  } catch (error) {
    console.error('❌ Neon Database connection error:', error.message)
  }
}

testConnection()

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err.message)
})

export default pool
