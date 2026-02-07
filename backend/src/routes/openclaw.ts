import { Router, RequestHandler } from 'express'
import { getSummary, getAlerts, createInvoice, getCashflow } from '../controllers/openclaw'
import { openClawAuth } from '../middleware/openclaw-auth'
import { rateLimit } from 'express-rate-limit'

const router = Router()

// Rate Limiter for OpenClaw
const openClawLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from OpenClaw'
})

// Apply Auth & Rate Limit
router.use(openClawAuth as RequestHandler)
router.use(openClawLimiter)

router.get('/summary', getSummary as RequestHandler)
router.get('/alerts', getAlerts as RequestHandler)
router.post('/invoice', createInvoice as RequestHandler)
router.get('/cashflow', getCashflow as RequestHandler)

export default router
