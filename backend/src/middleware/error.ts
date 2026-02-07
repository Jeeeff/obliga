import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '../utils/logger'
import { env } from '../config/env'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requestId = req.id
  
  // Log the error
  logger.error({ 
    err, 
    requestId,
    method: req.method,
    path: req.path
  }, 'Request failed')

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors,
      requestId
    })
  }

  if (err.name === 'UnauthorizedError' || err.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized', requestId })
  }

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Don't leak stack traces in production
  const response: any = {
    error: message,
    requestId
  }

  if (env.NODE_ENV !== 'production') {
    response.stack = err.stack
  }

  res.status(statusCode).json(response)
}
