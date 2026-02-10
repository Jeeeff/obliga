import { Response, NextFunction } from 'express'
import prisma from '../utils/prisma'
import { OpenClawRequest } from '../middleware/openclaw-auth'

type SkillName = 'demo_overview'

interface ExecuteSkillBody {
  skill: SkillName
}

export const executeSkill = async (req: OpenClawRequest, res: Response, next: NextFunction) => {
  try {
    const { skill } = req.body as ExecuteSkillBody

    if (!skill) {
      return res.status(400).json({ error: 'Skill is required' })
    }

    if (skill !== 'demo_overview') {
      return res.status(400).json({ error: 'Skill not enabled for this plan' })
    }

    const tenantId = req.tenant!.id

    const [totalObligations, overdueObligations, approvedObligations, totalClients] = await Promise.all([
      prisma.obligation.count({ where: { tenantId } }),
      prisma.obligation.count({ where: { tenantId, status: 'OVERDUE' } }),
      prisma.obligation.count({ where: { tenantId, status: 'APPROVED' } }),
      prisma.client.count({ where: { tenantId } }),
    ])

    const upcoming = await prisma.obligation.findMany({
      where: {
        tenantId,
        status: { in: ['PENDING', 'SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUESTED'] },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
      include: { client: true },
    })

    const upcomingMapped = upcoming.map((o) => ({
      id: o.id,
      title: o.title,
      dueDate: o.dueDate,
      status: o.status,
      clientName: o.client.name,
    }))

    res.json({
      skill: 'demo_overview',
      data: {
        totals: {
          obligations: totalObligations,
          overdueObligations,
          approvedObligations,
          clients: totalClients,
        },
        upcoming: upcomingMapped,
      },
    })
  } catch (error) {
    next(error)
  }
}

