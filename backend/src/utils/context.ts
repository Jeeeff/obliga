import { AsyncLocalStorage } from 'async_hooks'

export interface Context {
  tenantId?: string
  userId?: string
}

export const context = new AsyncLocalStorage<Context>()

export const getContext = () => context.getStore()
