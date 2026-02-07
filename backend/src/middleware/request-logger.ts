import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'

// Extend Express Request to include id
declare global {
  namespace Express {
    interface Request {
      id: string
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  req.id = uuidv4()
  const start = Date.now()

  // Log response when it finishes
  res.on('finish', () => {
    const duration = Date.now() - start
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info'
    
    // Extract user/workspace info if available (set by auth middleware)
    const userId = (req as any).user?.userId
    const workspaceId = (req as any).user?.workspaceId

    logger[logLevel]({
      type: 'request',
      requestId: req.id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      latency: `${duration}ms`,
      userId,
      workspaceId,
      userAgent: req.get('user-agent'),
      ip: req.ip
    })
  })

  next()
}
