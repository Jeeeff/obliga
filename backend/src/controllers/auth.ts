import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
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
  tenantName: z.string().optional(), // If creating a new tenant
  tenantId: z.string().optional(), // If joining existing
  clientId: z.string().optional(), // If CLIENT
})

import { emailService } from '../services/email.service'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Security Check: Disable register in production unless bootstrap key is provided
    if (env.NODE_ENV === 'production') {
        const bootstrapKey = req.headers['x-admin-bootstrap-key']
        if (!env.ADMIN_BOOTSTRAP_KEY || bootstrapKey !== env.ADMIN_BOOTSTRAP_KEY) {
            return res.status(403).json({ error: 'Registration is disabled in production' })
        }
    }

    const { name, email, password, role, tenantName, tenantId, clientId } = registerSchema.parse(req.body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    let targetTenantId = tenantId

    // Create tenant if not provided
    if (!targetTenantId && tenantName) {
      // Generate slug from name (simple version)
      const slug = tenantName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000)
      
      const tenant = await prisma.tenant.create({
        data: { name: tenantName, slug, plan: 'FREE', status: 'ACTIVE' }
      })
      targetTenantId = tenant.id
    }

    if (!targetTenantId) {
      return res.status(400).json({ error: 'Tenant ID or Name required' })
    }

    // Validate client if provided
    if (clientId) {
        const client = await prisma.client.findFirst({
            where: { id: clientId, tenantId: targetTenantId }
        })
        if (!client) {
            return res.status(400).json({ error: 'Invalid client for this tenant' })
        }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        tenantId: targetTenantId,
        clientId
      }
    })

    // Send welcome email
    try {
        const tenant = await prisma.tenant.findUnique({ where: { id: targetTenantId } })
        if (tenant) {
            await emailService.sendWelcomeEmail(user.email, user.name, tenant.name)
        }
    } catch (emailError) {
        // Don't fail registration if email fails
        console.error('Failed to send welcome email', emailError)
    }

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
            include: { tenant: true, client: true }
        })
        
        if (!user) return res.status(404).json({ error: 'User not found' })

        // Remove sensitive data
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const { passwordHash, ...userData } = user
        res.json(userData)
    } catch (error) {
        next(error)
    }
}
