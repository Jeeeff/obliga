import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../utils/prisma'
import { generateTokens, verifyRefreshToken } from '../utils/jwt'
import { z } from 'zod'
import { AuthRequest } from '../middleware/auth'
import { env } from '../config/env'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'CLIENT']),
  workspaceName: z.string().optional(), // If creating a new workspace
  workspaceId: z.string().optional(), // If joining existing
  clientId: z.string().optional(), // If CLIENT
})

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Security Check: Disable register in production unless bootstrap key is provided
    if (env.NODE_ENV === 'production') {
        const bootstrapKey = req.headers['x-admin-bootstrap-key']
        if (!env.ADMIN_BOOTSTRAP_KEY || bootstrapKey !== env.ADMIN_BOOTSTRAP_KEY) {
            return res.status(403).json({ error: 'Registration is disabled in production' })
        }
    }

    const { name, email, password, role, workspaceName, workspaceId, clientId } = registerSchema.parse(req.body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    let targetWorkspaceId = workspaceId

    // Create workspace if not provided
    if (!targetWorkspaceId && workspaceName) {
      const workspace = await prisma.workspace.create({
        data: { name: workspaceName }
      })
      targetWorkspaceId = workspace.id
    }

    if (!targetWorkspaceId) {
      return res.status(400).json({ error: 'Workspace ID or Name required' })
    }

    // Validate client if provided
    if (clientId) {
        const client = await prisma.client.findFirst({
            where: { id: clientId, workspaceId: targetWorkspaceId }
        })
        if (!client) {
            return res.status(400).json({ error: 'Invalid client for this workspace' })
        }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        workspaceId: targetWorkspaceId,
        clientId
      }
    })

    const tokens = generateTokens(user)
    res.json(tokens)
  } catch (error) {
    next(error)
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const tokens = generateTokens(user)
    res.json(tokens)
  } catch (error) {
    next(error)
  }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' })

    const payload = verifyRefreshToken(refreshToken)
    
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.status(401).json({ error: 'User not found' })

    const tokens = generateTokens(user)
    res.json(tokens)
  } catch (error) {
    next(error)
  }
}

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.userId },
            include: { workspace: true, client: true }
        })
        
        if (!user) return res.status(404).json({ error: 'User not found' })

        // Remove sensitive data
        const { passwordHash, ...userData } = user
        res.json(userData)
    } catch (error) {
        next(error)
    }
}
