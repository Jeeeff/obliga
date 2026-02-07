import jwt from 'jsonwebtoken'
import { User, Role as UserRole } from '@prisma/client'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret'

export interface JwtPayload {
  userId: string
  tenantId: string
  role: UserRole
  clientId?: string | null
}

export const generateTokens = (user: User) => {
  const payload: JwtPayload = { 
    userId: user.id, 
    tenantId: user.tenantId, 
    role: user.role, 
    clientId: user.clientId 
  }
  
  const accessToken = jwt.sign(
    payload,
    ACCESS_SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    payload,
    REFRESH_SECRET,
    { expiresIn: '7d' }
  )

  return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload
}

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload
}

