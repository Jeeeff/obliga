import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { verifyAccessToken } from '../utils/jwt'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    workspaceId: string
    role: 'ADMIN' | 'CLIENT'
    clientId?: string | null
  }
}

const tokenPayloadSchema = z.object({
  userId: z.string(),
  workspaceId: z.string(),
  role: z.enum(['ADMIN', 'CLIENT']),
  clientId: z.string().nullable().optional(),
})

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.slice('Bearer '.length).trim()
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' })

  try {
    const decoded = verifyAccessToken(token)
    const payload = tokenPayloadSchema.parse(decoded)

    req.user = payload
    next()
  } catch (_error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}

export const requireRole = (roles: ('ADMIN' | 'CLIENT')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' })
    }
    next()
  }
}
