import { logger } from '../../utils/logger'
import { env } from '../../config/env'

export interface OpenClawContext {
    requestId: string
    actorUserId: string
    workspaceId: string
    featureFlags?: Record<string, boolean>
}

export interface OpenClawClient {
    analyzeObligation(obligationId: string, context: OpenClawContext): Promise<void>
    suggestActions(obligationId: string, context: OpenClawContext): Promise<void>
}

class OpenClawStub implements OpenClawClient {
    private enabled: boolean

    constructor() {
        this.enabled = env.OPENCLAW_ENABLED
    }

    private logCall(method: string, context: OpenClawContext, data: any) {
        if (!this.enabled) return

        logger.info({
            module: 'OpenClaw',
            method,
            context: {
                ...context,
                featureFlags: {
                    ...context.featureFlags,
                    OPENCLAW_ENABLED: this.enabled
                }
            },
            data
        }, 'OpenClaw Stub Called')
    }

    async analyzeObligation(obligationId: string, context: OpenClawContext): Promise<void> {
        this.logCall('analyzeObligation', context, { obligationId })
        return Promise.resolve()
    }

    async suggestActions(obligationId: string, context: OpenClawContext): Promise<void> {
        this.logCall('suggestActions', context, { obligationId })
        return Promise.resolve()
    }
}

export const openClaw = new OpenClawStub()
