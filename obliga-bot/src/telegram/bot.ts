import { Bot } from "grammy"
import { ObligaClient } from "../api/obliga-client"
import { AppLogger } from "../utils/logger"
import { setupCommands } from "./commands"

export function createBot(token: string, client: ObligaClient, logger: AppLogger): Bot {
  const bot = new Bot(token)
  setupCommands(bot, client, logger)
  return bot
}
