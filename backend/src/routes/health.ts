import { Router } from 'express';
import prisma from '../utils/prisma';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'obliga-backend'
    });
  } catch (error) {
    logger.error({ err: error }, 'Health check failed');
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Service Unavailable'
    });
  }
});

export default router;
