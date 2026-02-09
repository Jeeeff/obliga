import axios, { AxiosInstance, AxiosError } from "axios"
import { AppLogger } from "../utils/logger"
import { ClientSummary, CreateObligationInput, Obligation } from "../types"

export class ObligaClient {
  private readonly http: AxiosInstance
  private readonly logger: AppLogger

  constructor(baseUrl: string, logger: AppLogger) {
    this.logger = logger
    this.http = axios.create({
      baseURL: baseUrl,
      timeout: 10000
    })

    this.http.interceptors.request.use((config) => {
      this.logger.debug({
        msg: "HTTP request",
        method: config.method,
        url: config.url,
        params: config.params
      })
      return config
    })

    this.http.interceptors.response.use(
      (response) => {
        this.logger.debug({
          msg: "HTTP response",
          status: response.status,
          url: response.config.url
        })
        return response
      },
      (error) => {
        if (error.response) {
          this.logger.warn({
            msg: "HTTP error response",
            status: error.response.status,
            url: error.config?.url,
            data: error.response.data
          })
        } else {
          this.logger.error({
            msg: "HTTP error",
            error: error.message
          })
        }
        return Promise.reject(error)
      }
    )
  }

  private async requestWithRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
    let attempt = 0
    for (;;) {
      try {
        return await fn()
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        attempt += 1
        const status = axiosError.response?.status
        const retriable =
          !status || (status >= 500 && status < 600)
        if (!retriable || attempt > retries) {
          throw this.wrapError(error)
        }
      }
    }
  }

  private wrapError(error: unknown): Error {
    const axiosError = error as AxiosError | undefined
    const status = axiosError?.response?.status
    if (status === 401 || status === 403) {
      return new Error("Não autorizado. Verifique suas credenciais.")
    }
    if (status === 500) {
      return new Error("Erro interno na API do Obliga.")
    }
    const code = axiosError?.code
    if (code === "ECONNABORTED") {
      return new Error("Tempo de requisição excedido para a API do Obliga.")
    }
    if (code === "ECONNREFUSED") {
      return new Error("Não foi possível conectar à API do Obliga.")
    }
    if (error instanceof Error) {
      return error
    }
    return new Error("Erro desconhecido ao chamar a API do Obliga.")
  }

  private authHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`
    }
  }

  async authenticate(email: string, password: string): Promise<string> {
    const response = await this.requestWithRetry(() =>
      this.http.post<{ accessToken?: string; token?: string }>("/auth/login", { email, password })
    )
    const data = response.data
    const token = data?.accessToken || data?.token
    if (!token) {
      throw new Error("Resposta de login sem token de acesso.")
    }
    return token as string
  }

  async getObligations(token: string, filters?: Record<string, unknown>): Promise<Obligation[]> {
    const response = await this.requestWithRetry(() =>
      this.http.get<Obligation[]>("/obligations", {
        headers: this.authHeaders(token),
        params: filters
      })
    )
    return response.data
  }

  async getClients(token: string): Promise<ClientSummary[]> {
    const response = await this.requestWithRetry(() =>
      this.http.get<ClientSummary[]>("/clients", {
        headers: this.authHeaders(token)
      })
    )
    return response.data
  }

  async createObligation(token: string, data: CreateObligationInput): Promise<Obligation> {
    const response = await this.requestWithRetry(() =>
      this.http.post<Obligation>("/obligations", data, {
        headers: this.authHeaders(token)
      })
    )
    return response.data
  }

  async getUpcomingObligations(token: string, days: number): Promise<Obligation[]> {
    const obligations = await this.getObligations(token)
    const now = new Date()
    const limit = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    const parsed = obligations
      .map((o) => {
        const date = new Date(o.dueDate)
        return { obligation: o, date }
      })
      .filter((entry) => entry.date >= now && entry.date <= limit)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
    return parsed.map((entry) => entry.obligation)
  }
}
