import { prisma } from '../config/database'
import { Opportunity, CreateOpportunityRequest, UpdateOpportunityRequest, OpportunityFilters, PaginationOptions, PaginatedResponse, DashboardMetrics } from '../types'
import { OpportunityStage } from '@prisma/client'

export class OpportunityService {
  async createOpportunity(userId: string, opportunityData: CreateOpportunityRequest): Promise<Opportunity> {
    const opportunity = await prisma.opportunity.create({
      data: {
        ...opportunityData,
        closeDate: opportunityData.closeDate ? new Date(opportunityData.closeDate) : null,
        createdById: userId,
      },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    // Create history entry
    await prisma.opportunityHistory.create({
      data: {
        opportunityId: opportunity.id,
        newStage: opportunity.stage,
        changedById: userId,
        changeReason: 'Opportunity created',
      },
    })

    return {
      ...opportunity,
      value: opportunity.value ? Number(opportunity.value) : 0,
    } as unknown as Opportunity
  }

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        history: {
          include: {
            changedBy: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            changedAt: 'desc',
          },
        },
      },
    })

    if (!opportunity) return null

    return {
      ...opportunity,
      value: opportunity.value ? Number(opportunity.value) : 0,
    } as unknown as Opportunity
  }

  async getOpportunities(
    filters: OpportunityFilters = {},
    pagination: PaginationOptions = {},
    userId: string,
    userRole: string
  ): Promise<PaginatedResponse<Opportunity>> {
    const { page = 1, limit = 20 } = pagination
    const { search, stage, assignedToId, contactId, minValue, maxValue, closeDateFrom, closeDateTo } = filters

    // Build where clause
    const where: any = {}

    // Role-based filtering
    if (userRole === 'SALES_REP') {
      // Sales reps can only see their own opportunities or unassigned ones
      where.OR = [
        { assignedToId: userId },
        { assignedToId: null },
        { createdById: userId },
      ]
    } else if (userRole === 'MANAGER') {
      // Managers can see all opportunities
      // No additional filtering needed
    }
    // Admins can see all

    // Apply filters
    if (search) {
      where.OR = where.OR || []
      where.OR.push(
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        {
          contact: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { company: { contains: search, mode: 'insensitive' } },
            ],
          },
        }
      )
    }

    if (stage) {
      where.stage = stage
    }

    if (assignedToId) {
      where.assignedToId = assignedToId
    }

    if (contactId) {
      where.contactId = contactId
    }

    if (minValue !== undefined || maxValue !== undefined) {
      where.value = {}
      if (minValue !== undefined) {
        where.value.gte = minValue
      }
      if (maxValue !== undefined) {
        where.value.lte = maxValue
      }
    }

    if (closeDateFrom || closeDateTo) {
      where.closeDate = {}
      if (closeDateFrom) {
        where.closeDate.gte = new Date(closeDateFrom)
      }
      if (closeDateTo) {
        where.closeDate.lte = new Date(closeDateTo)
      }
    }

    // Get total count
    const total = await prisma.opportunity.count({ where })

    // Get paginated results
    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalPages = Math.ceil(total / limit)

    const mappedOpportunities = opportunities.map((opp: any) => ({
      ...opp,
      value: opp.value ? Number(opp.value) : 0,
    }))

    return {
      success: true,
      data: mappedOpportunities as unknown as Opportunity[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async updateOpportunity(id: string, updateData: UpdateOpportunityRequest, changedById: string): Promise<Opportunity> {
    // Get current opportunity for history tracking
    const currentOpportunity = await prisma.opportunity.findUnique({
      where: { id },
    })

    if (!currentOpportunity) {
      throw new Error('Opportunity not found')
    }

    // Check if stage is being changed
    let stageChanged = false
    if (updateData.stage && updateData.stage !== currentOpportunity.stage) {
      stageChanged = true
    }

    const opportunity = await prisma.opportunity.update({
      where: { id },
      data: {
        ...updateData,
        closeDate: updateData.closeDate ? new Date(updateData.closeDate) : undefined,
      },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    // Create history entry if stage changed
    if (stageChanged) {
      await prisma.opportunityHistory.create({
        data: {
          opportunityId: id,
          previousStage: currentOpportunity.stage,
          newStage: opportunity.stage,
          changedById,
          changeReason: 'Stage updated',
        },
      })
    }

    return {
      ...opportunity,
      value: opportunity.value ? Number(opportunity.value) : 0,
    } as unknown as Opportunity
  }

  async deleteOpportunity(id: string): Promise<void> {
    await prisma.opportunity.delete({
      where: { id },
    })
  }

  async getDashboardMetrics(userId: string, userRole: string): Promise<DashboardMetrics> {
    let whereClause: any = {}

    if (userRole === 'SALES_REP') {
      whereClause = {
        OR: [
          { assignedToId: userId },
          { createdById: userId },
        ],
      }
    }

    // Get opportunities by stage
    const opportunitiesByStage = await prisma.opportunity.groupBy({
      by: ['stage'],
      where: whereClause,
      _count: {
        stage: true,
      },
      _sum: {
        value: true,
      },
    })

    const stageCounts: Record<OpportunityStage, number> = {
      PROSPECT: 0,
      QUALIFIED: 0,
      PROPOSAL: 0,
      NEGOTIATION: 0,
      CLOSED_WON: 0,
      CLOSED_LOST: 0,
    }

    let totalValue = 0
    opportunitiesByStage.forEach((item: any) => {
      stageCounts[item.stage as OpportunityStage] = item._count.stage
      totalValue += item._sum.value ? Number(item._sum.value) : 0
    })

    // Get recent opportunities
    const recentOpportunities = await prisma.opportunity.findMany({
      where: whereClause,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
    })

    // Calculate pipeline value (exclude closed opportunities)
    const pipelineValue = await prisma.opportunity.aggregate({
      where: {
        ...whereClause,
        stage: {
          notIn: ['CLOSED_WON', 'CLOSED_LOST'],
        },
      },
      _sum: {
        value: true,
      },
    })

    // Get total counts
    const [totalContacts, totalOpportunities] = await Promise.all([
      prisma.contact.count({ where: userRole === 'SALES_REP' ? {
        OR: [
          { assignedToId: userId },
          { createdById: userId },
        ],
      } : {} }),
      prisma.opportunity.count({ where: whereClause }),
    ])

    const mappedRecentOpportunities = recentOpportunities.map((opp: any) => ({
      ...opp,
      value: opp.value ? Number(opp.value) : 0,
    }))

    return {
      totalContacts,
      totalOpportunities,
      totalValue,
      opportunitiesByStage: stageCounts,
      recentOpportunities: mappedRecentOpportunities as unknown as Opportunity[],
      pipelineValue: pipelineValue._sum.value ? Number(pipelineValue._sum.value) : 0,
    }
  }
}
