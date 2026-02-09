import pino, { Logger } from "pino"
import { env } from "../config/env"

const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      options: {
        destination: "logs/bot.log",
        mkdir: true
      }
    }
  ]
})

export type AppLogger = Logger

export const logger: AppLogger = pino(
  {
    level: env.logLevel,
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime
  },
  transport
)

export function createLogger(context: string): AppLogger {
  return logger.child({ context })
}
