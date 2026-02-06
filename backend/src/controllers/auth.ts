import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../utils/prisma'
import { generateTokens, verifyRefreshToken } from '../utils/jwt'
import { z } from 'zod'
import { AuthRequest } from '../middleware/auth'

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

    const decoded = verifyRefreshToken(refreshToken)
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })

    if (!user) return res.status(401).json({ error: 'User not found' })

    const tokens = generateTokens(user)
    res.json(tokens)
  } catch (error) {
    next(error)
  }
}

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { workspace: true, client: true }
    })

    if (!user) return res.status(404).json({ error: 'User not found' })

    const { passwordHash, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    next(error)
  }
}
