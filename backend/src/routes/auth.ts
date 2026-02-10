import { Router } from 'express'
import { login, register, refresh, me, updateMe } from '../controllers/auth'
import { authenticate } from '../middleware/auth'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import prisma from '../utils/prisma'
import { AuthRequest } from '../middleware/auth'

const avatarUploadDir = path.join(process.cwd(), 'uploads', 'avatars')

if (!fs.existsSync(avatarUploadDir)) {
  fs.mkdirSync(avatarUploadDir, { recursive: true })
}

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, avatarUploadDir)
  },
  filename: (req, file, cb) => {
    const authReq = req as AuthRequest
    const userId = authReq.user?.userId
    const ext = path.extname(file.originalname) || '.png'
    const safeId = userId || 'anonymous'
    cb(null, `${safeId}${ext}`)
  },
})

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
})

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.get('/me', authenticate, me)
router.patch('/me', authenticate, updateMe)
router.post(
  '/me/avatar',
  authenticate,
  avatarUpload.single('avatar'),
  async (req, res, next) => {
    try {
      const authReq = req as AuthRequest
      const userId = authReq.user?.userId

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const relativeUrl = `/uploads/avatars/${req.file.filename}`

      const user = await prisma.user.update({
        where: { id: userId },
        data: { avatar: relativeUrl },
        include: { tenant: true, client: true },
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...userData } = user
      res.json(userData)
    } catch (error) {
      next(error)
    }
  },
)

export default router
