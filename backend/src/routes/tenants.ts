import { Router } from 'express'
import { register } from '../controllers/auth'

const router = Router()

// Route: POST /api/tenants/register
// Reuses the auth registration logic which handles tenant creation
router.post('/register', register)

export default router
