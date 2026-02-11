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

  const enableTelegram = env.nodeEnv === "production"
  const hasTelegramBot = enableTelegram && !!env.telegramBotToken
  const bot = hasTelegramBot
    ? createBot(env.telegramBotToken, obligaClient, createLogger("TelegramBot"))
    : null

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

    if (req.method === "GET" && req.url && req.url.startsWith("/whatsapp/webhook")) {
      const url = new URL(req.url, `http://localhost:${env.port}`)
      const mode = url.searchParams.get("hub.mode")
      const token = url.searchParams.get("hub.verify_token")
      const challenge = url.searchParams.get("hub.challenge")

      if (mode === "subscribe" && token === "obliga-dev-verify") {
        res.statusCode = 200
        res.end(challenge || "OK")
      } else {
        res.statusCode = 403
        res.end("Forbidden")
      }
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

          logger.info(
            {
              hasWhatsAppClient: !!whatsappClient,
              from,
              text,
              rawType: message?.type
            },
            "Webhook WhatsApp recebido"
          )

          if (whatsappClient && from && text) {
            const reply =
              "Olá, esta é uma demonstração do Obliga com OpenClaw.\n" +
              "No plano gratuito, você pode conectar seu painel e receber resumos básicos de obrigações."
            whatsappClient
              .sendTextMessage({ to: from, text: reply })
              .then(() => {
                logger.info({ to: from }, "Resposta WhatsApp enviada com sucesso")
              })
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

  if (bot) {
    await bot.start()
  }

  server.listen(env.port, () => {
    logger.info({ port: env.port }, "Servidor HTTP do bot iniciado")
  })

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Encerrando obliga-bot")
    server.close(() => {
      logger.info("Servidor HTTP encerrado")
    })
    if (bot) {
      await bot.stop()
      logger.info("Bot Telegram encerrado")
    }
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
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  bootstrapLogger.error(
    {
      errorMessage,
      errorStack
    },
    "Erro fatal ao iniciar obliga-bot"
  )
  process.exit(1)
})
