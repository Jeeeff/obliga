import pino from 'pino'
import path from 'path'
import fs from 'fs'
import { env } from '../config/env'

const logDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const transport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      options: {
        colorize: true,
        destination: 1, // stdout
        translateTime: 'SYS:standard',
      },
    },
    {
      target: 'pino/file',
      options: {
        destination: path.join(logDir, 'app.log'),
        mkdir: true,
      },
    },
  ],
})

export const logger = pino(
  {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    redact: {
        paths: ['req.headers.authorization', 'req.body.password', 'req.body.token'],
        remove: true
    },
    serializers: {
        err: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res
    }
  },
  transport
)
