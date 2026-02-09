type ChatId = number | string

const tokens = new Map<string, string>()

function key(chatId: ChatId): string {
  return chatId.toString()
}

export function saveToken(chatId: ChatId, token: string): void {
  tokens.set(key(chatId), token)
}

export function getToken(chatId: ChatId): string | undefined {
  return tokens.get(key(chatId))
}

export function removeToken(chatId: ChatId): void {
  tokens.delete(key(chatId))
}

export function isAuthenticated(chatId: ChatId): boolean {
  return tokens.has(key(chatId))
}
