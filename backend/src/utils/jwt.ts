import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret'

export const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    { userId: user.id, tenantId: user.tenantId, role: user.role, clientId: user.clientId },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { userId: user.id, tenantId: user.tenantId, role: user.role, clientId: user.clientId },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  )

  return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET) as any
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET) as any
}
