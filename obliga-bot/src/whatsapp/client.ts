import axios, { AxiosInstance } from "axios"
import { AppLogger } from "../utils/logger"

interface SendMessagePayload {
  to: string
  text: string
}

export class WhatsAppClient {
  private readonly http: AxiosInstance
  private readonly logger: AppLogger
  private readonly phoneNumberId: string

  constructor(baseUrl: string, phoneNumberId: string, token: string, logger: AppLogger) {
    this.logger = logger
    this.phoneNumberId = phoneNumberId
    this.http = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
  }

  async sendTextMessage(payload: SendMessagePayload) {
    try {
      const body = {
        messaging_product: "whatsapp",
        to: payload.to,
        type: "text",
        text: { body: payload.text },
      }

      await this.http.post(`/v20.0/${this.phoneNumberId}/messages`, body)
    } catch (error) {
      this.logger.error({ error }, "Erro ao enviar mensagem WhatsApp")
      throw error
    }
  }
}

