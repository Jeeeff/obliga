import http from "http"
import { env } from "./config/env"
import { createLogger } from "./utils/logger"
import { ObligaClient } from "./api/obliga-client"
import { createBot } from "./telegram/bot"

const bootstrapLogger = createLogger("bootstrap")

async function main() {
  const logger = bootstrapLogger

  const obligaClient = new ObligaClient(env.obligaApiUrl, createLogger("ObligaClient"))
  const bot = createBot(env.telegramBotToken, obligaClient, createLogger("TelegramBot"))

  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      const body = JSON.stringify({
        status: "ok",
        uptime: process.uptime()
      })
      res.statusCode = 200
      res.setHeader("Content-Type", "application/json")
      res.setHeader("Content-Length", Buffer.byteLength(body))
      res.end(body)
      return
    }
    res.statusCode = 404
    res.end()
  })

  await bot.start()

  server.listen(env.port, () => {
    logger.info({ port: env.port }, "Servidor HTTP do bot iniciado")
  })

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Encerrando obliga-bot")
    server.close(() => {
      logger.info("Servidor HTTP encerrado")
    })
    await bot.stop()
    logger.info("Bot Telegram encerrado")
    process.exit(0)
  }

  process.on("SIGINT", () => {
    void shutdown("SIGINT")
  })
  process.on("SIGTERM", () => {
    void shutdown("SIGTERM")
  })
}

main().catch((error) => {
  bootstrapLogger.error({ error }, "Erro fatal ao iniciar obliga-bot")
  process.exit(1)
})
