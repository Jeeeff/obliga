import { Router } from 'express'
import { handleWebhook } from '../controllers/webhooks'

const router = Router()

// Webhook endpoint (Public or Protected by Signature - skipping signature for MVP)
router.post('/openclaw', handleWebhook)

export default router
