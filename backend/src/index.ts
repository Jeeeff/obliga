import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import clientRoutes from './routes/clients'
import obligationRoutes from './routes/obligations'
import activityRoutes from './routes/activity'
import { errorHandler } from './middleware/error'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/clients', clientRoutes)
app.use('/obligations', obligationRoutes)
app.use('/activity', activityRoutes)

app.get('/', (req, res) => {
  res.send('DevLogic Obliga Backend is running')
})

app.use(errorHandler)

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app
