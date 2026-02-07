import { Router } from 'express'
import { downloadAttachment } from '../controllers/attachments'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/:id/download', downloadAttachment)

export default router
