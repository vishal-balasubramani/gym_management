import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import authRoutes from './src/routers/auth.js'
import adminRoutes from './src/routers/admin.js'
import trainerRoutes from './src/routers/trainerRoutes.js'
import traineeRoutes from './src/routers/traineeRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/trainee', traineeRoutes)
app.use('/api/trainer', trainerRoutes)


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
