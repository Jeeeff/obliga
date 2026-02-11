import dotenv from "dotenv"

dotenv.config({ override: true })

function getEnv(name: string, required: boolean, defaultValue?: string) {
  const value = process.env[name]
  if (value === undefined || value === "") {
    if (required && defaultValue === undefined) {
      throw new Error(`Missing required environment variable ${name}`)
    }
    return defaultValue
  }
  return value
}

const nodeEnv = getEnv("NODE_ENV", false, "development") as string
const portRaw = getEnv("PORT", false, "3001") as string
const port = Number.parseInt(portRaw, 10)
if (Number.isNaN(port)) {
  throw new Error("PORT must be a number")
}

const obligaApiUrl = getEnv("OBLIGA_API_URL", true) as string
const telegramBotToken = getEnv("TELEGRAM_BOT_TOKEN", false, "") as string
const whatsappBaseUrl = getEnv("WHATSAPP_BASE_URL", false, "https://graph.facebook.com") as string
const whatsappPhoneNumberId = getEnv("WHATSAPP_PHONE_NUMBER_ID", false, "") as string
const whatsappAccessToken = getEnv("WHATSAPP_ACCESS_TOKEN", false, "") as string
const logLevel = (getEnv("LOG_LEVEL", false, "info") as string).toLowerCase()

export const env = {
  nodeEnv,
  port,
  obligaApiUrl,
  telegramBotToken,
  whatsappBaseUrl,
  whatsappPhoneNumberId,
  whatsappAccessToken,
  logLevel,
}
