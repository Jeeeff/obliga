import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err)

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors,
    })
  }

  if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ error: 'Unauthorized' })
  }

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    error: message,
  })
}
