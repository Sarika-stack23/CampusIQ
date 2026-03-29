import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import errorHandler from './middlewares/error.js'
import authRoutes from './modules/auth/auth.routes.js'
import taskRoutes from './modules/tasks/task.routes.js'
import attendanceRoutes from './modules/attendance/attendance.routes.js'

const app = express()

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CampusIQ API is running', version: '1.0.0' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/attendance', attendanceRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// Global error handler — must be last
app.use(errorHandler)

export default app