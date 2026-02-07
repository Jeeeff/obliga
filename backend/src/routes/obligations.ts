import { Router } from 'express'
import { 
    listObligations, 
    createObligation, 
    getObligation, 
    updateObligation, 
    submitObligation, 
    approveObligation, 
    requestChangesObligation, 
    resetObligation,
    addComment,
    getComments
} from '../controllers/obligations'
import { uploadMiddleware, uploadAttachment, listAttachments } from '../controllers/attachments'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/', listObligations)
router.post('/', requireRole(['ADMIN']), createObligation)
router.get('/:id', getObligation)
router.patch('/:id', requireRole(['ADMIN']), updateObligation)

// Status transitions
router.post('/:id/submit', requireRole(['CLIENT']), submitObligation)
router.post('/:id/approve', requireRole(['ADMIN']), approveObligation)
router.post('/:id/request-changes', requireRole(['ADMIN']), requestChangesObligation)
router.post('/:id/reset', requireRole(['ADMIN']), resetObligation)

// Comments
router.get('/:id/comments', getComments)
router.post('/:id/comments', addComment)

// Attachments
router.post('/:id/attachments', uploadMiddleware, uploadAttachment)
router.get('/:id/attachments', listAttachments)

export default router
