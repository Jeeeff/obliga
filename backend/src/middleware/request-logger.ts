import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  req.id = uuidv4()
  const start = Date.now()

  // Log response when it finishes
  res.on('finish', () => {
    const duration = Date.now() - start
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info'
    
    // Extract user/tenant info if available (set by auth middleware)
    const userId = req.user?.userId
    const tenantId = req.user?.tenantId

    logger[logLevel]({
      type: 'request',
      requestId: req.id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      latency: `${duration}ms`,
      userId,
      tenantId,
      userAgent: req.get('user-agent'),
      ip: req.ip
    })
  })

  next()
}

