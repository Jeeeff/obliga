import http from "http"
import { env } from "./config/env"
import { createLogger } from "./utils/logger"
import { ObligaClient } from "./api/obliga-client"
import { createBot } from "./telegram/bot"
import { WhatsAppClient } from "./whatsapp/client"

const bootstrapLogger = createLogger("bootstrap")

async function main() {
  const logger = bootstrapLogger

  const obligaClient = new ObligaClient(env.obligaApiUrl, createLogger("ObligaClient"))
  const bot = createBot(env.telegramBotToken, obligaClient, createLogger("TelegramBot"))

  const whatsappClient =
    env.whatsappPhoneNumberId && env.whatsappAccessToken
      ? new WhatsAppClient(
          env.whatsappBaseUrl,
          env.whatsappPhoneNumberId,
          env.whatsappAccessToken,
          createLogger("WhatsAppClient")
        )
      : null

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

    if (req.method === "POST" && req.url === "/whatsapp/webhook") {
      let body = ""
      req.on("data", (chunk) => {
        body += chunk.toString()
      })
      req.on("end", () => {
        try {
          const payload = JSON.parse(body)
          const entry = payload.entry?.[0]
          const change = entry?.changes?.[0]
          const messages = change?.value?.messages
          const message = messages?.[0]
          const from = message?.from
          const text = message?.text?.body as string | undefined

          if (whatsappClient && from && text) {
            const reply =
              "Olá, esta é uma demonstração do Obliga com OpenClaw.\n" +
              "No plano gratuito, você pode conectar seu painel e receber resumos básicos de obrigações."
            whatsappClient
              .sendTextMessage({ to: from, text: reply })
              .catch((error) => logger.error({ error }, "Erro ao responder mensagem WhatsApp"))
          }

          res.statusCode = 200
          res.end("OK")
        } catch (error) {
          logger.error({ error }, "Erro ao processar webhook WhatsApp")
          res.statusCode = 400
          res.end("Bad Request")
        }
      })
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
