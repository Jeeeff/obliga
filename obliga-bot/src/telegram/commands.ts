import { Bot } from "grammy"
import { ObligaClient } from "../api/obliga-client"
import { AppLogger } from "../utils/logger"
import { getToken, isAuthenticated, removeToken, saveToken } from "../utils/auth"
import { formatObligationsList, safeReply } from "./handlers"

type LoginStep = "email" | "password"

interface LoginState {
  step: LoginStep
  email?: string
}

interface RateLimitState {
  count: number
  windowStart: number
}

export function setupCommands(bot: Bot, client: ObligaClient, logger: AppLogger): void {
  const loginState = new Map<number, LoginState>()
  const rateLimit = new Map<number, RateLimitState>()

  bot.use(async (ctx, next) => {
    const chatId = ctx.chat?.id
    if (!chatId) {
      return next()
    }
    const now = Date.now()
    const current = rateLimit.get(chatId) || { count: 0, windowStart: now }
    if (now - current.windowStart > 60_000) {
      current.count = 0
      current.windowStart = now
    }
    current.count += 1
    rateLimit.set(chatId, current)
    if (current.count > 10) {
      await safeReply(ctx, "Você está enviando comandos muito rápido. Tente novamente em instantes.")
      return
    }
    return next()
  })

  const protectedCommands = new Set(["obrigacoes", "proximas", "logout"])

  bot.use(async (ctx, next) => {
    const text = ctx.message?.text
    if (!text) {
      return next()
    }
    if (!text.startsWith("/")) {
      return next()
    }
    const command = text.split(" ")[0].slice(1)
    if (!protectedCommands.has(command)) {
      return next()
    }
    const chatId = ctx.chat?.id
    if (!chatId || !isAuthenticated(chatId)) {
      await safeReply(ctx, "Você precisa estar autenticado. Use /login para entrar.")
      return
    }
    return next()
  })

  bot.command("start", async (ctx) => {
    const text =
      "Bem-vindo ao Obliga Bot.\n\n" +
      "Use /login para conectar com sua conta do Obliga.\n" +
      "Depois, use /obrigacoes para ver suas tarefas e /proximas para próximas obrigações."
    await safeReply(ctx, text)
  })

  bot.command("login", async (ctx) => {
    const chatId = ctx.chat?.id
    if (!chatId) {
      return
    }
    loginState.set(chatId, { step: "email" })
    await safeReply(ctx, "Envie seu e-mail cadastrado no Obliga.")
  })

  bot.command("logout", async (ctx) => {
    const chatId = ctx.chat?.id
    if (!chatId) {
      return
    }
    if (!isAuthenticated(chatId)) {
      await safeReply(ctx, "Você já não está autenticado.")
      return
    }
    removeToken(chatId)
    await safeReply(ctx, "Logout realizado com sucesso.")
  })

  bot.command("obrigacoes", async (ctx) => {
    const chatId = ctx.chat?.id
    if (!chatId) {
      return
    }
    const token = getToken(chatId)
    if (!token) {
      await safeReply(ctx, "Você precisa estar autenticado. Use /login para entrar.")
      return
    }
    try {
      const obligations = await client.getObligations(token)
      const message = formatObligationsList("Suas Obrigações", obligations)
      await safeReply(ctx, message)
    } catch (error: unknown) {
      logger.error({ error }, "Erro ao buscar obrigações")
      await safeReply(ctx, "Não foi possível carregar suas obrigações.")
    }
  })

  bot.command("proximas", async (ctx) => {
    const chatId = ctx.chat?.id
    if (!chatId) {
      return
    }
    const token = getToken(chatId)
    if (!token) {
      await safeReply(ctx, "Você precisa estar autenticado. Use /login para entrar.")
      return
    }
    try {
      const obligations = await client.getUpcomingObligations(token, 7)
      const message = formatObligationsList("Obrigações dos próximos 7 dias", obligations)
      await safeReply(ctx, message)
    } catch (error: unknown) {
      logger.error({ error }, "Erro ao buscar próximas obrigações")
      await safeReply(ctx, "Não foi possível carregar as próximas obrigações.")
    }
  })

  bot.on("message:text", async (ctx) => {
    const chatId = ctx.chat?.id
    if (!chatId) {
      return
    }
    const state = loginState.get(chatId)
    if (!state) {
      return
    }
    const text = ctx.message.text.trim()
    if (text.startsWith("/")) {
      loginState.delete(chatId)
      await safeReply(ctx, "Fluxo de login cancelado.")
      return
    }
    if (state.step === "email") {
      state.email = text
      state.step = "password"
      loginState.set(chatId, state)
      await safeReply(ctx, "Agora envie sua senha.")
      return
    }
    if (!state.email) {
      loginState.delete(chatId)
      await safeReply(ctx, "Fluxo de login inválido. Use /login novamente.")
      return
    }
    try {
      const token = await client.authenticate(state.email, text)
      saveToken(chatId, token)
      loginState.delete(chatId)
      await safeReply(ctx, "Login realizado! Use /obrigacoes para ver suas tarefas.")
    } catch (error: unknown) {
      loginState.delete(chatId)
      logger.warn({ error }, "Erro de login no bot")
      await safeReply(ctx, "Falha no login. Verifique seus dados e tente novamente.")
    }
  })
}
