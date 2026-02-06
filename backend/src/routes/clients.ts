import { Router } from 'express'
import { listClients, createClient, getClient, updateClient, deleteClient } from '../controllers/clients'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/', listClients)
router.post('/', requireRole(['ADMIN']), createClient)
router.get('/:id', getClient)
router.patch('/:id', requireRole(['ADMIN']), updateClient)
router.delete('/:id', requireRole(['ADMIN']), deleteClient)

export default router
