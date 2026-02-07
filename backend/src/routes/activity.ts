import { Router } from 'express'
import { listActivity } from '../controllers/activity'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/', requireRole(['ADMIN']), listActivity)

export default router
