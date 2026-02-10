import { Router } from 'express'
import { login, register, refresh, me, updateMe } from '../controllers/auth'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.get('/me', authenticate, me)
router.patch('/me', authenticate, updateMe)

export default router
