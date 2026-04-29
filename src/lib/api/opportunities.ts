import { apiClient } from './client'
import { CreateOpportunityInput, UpdateOpportunityInput } from '../validators'

export interface Opportunity {
  id: string
  title: string
  description?: string
  value: number
  stage: 'PROSPECT' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST'
  closeDate?: string
  contact: {
    id: string
    firstName: string
    lastName: string
    company?: string
    email: string
  }
  createdBy: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  assignedTo?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  history?: Array<{
    id: string
    previousStage?: string
    newStage: string
    changeReason: string
    changedBy: {
      firstName: string
      lastName: string
    }
    changedAt: string
  }>
  createdAt: string
  updatedAt: string
}

export interface PaginatedOpportunities {
  success: boolean
  data: Opportunity[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error?: {
    code: string
    message: string
  }
}

export interface DashboardMetrics {
  totalContacts: number
  totalOpportunities: number
  totalValue: number
  opportunitiesByStage: Record<string, number>
  recentOpportunities: Opportunity[]
  pipelineValue: number
}

export const opportunitiesApi = {
  async getOpportunities(filters?: {
    search?: string
    stage?: string
    assignedToId?: string
    contactId?: string
    minValue?: number
    maxValue?: number
    closeDateFrom?: string
    closeDateTo?: string
    page?: number
    limit?: number
  }): Promise<PaginatedOpportunities> {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: mockOpportunities,
        pagination: {
          page: 1,
          limit: 100,
          total: mockOpportunities.length,
          totalPages: 1
        }
      };
    }
    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }
    const query = queryParams.toString()
    return apiClient.get(`/opportunities${query ? `?${query}` : ''}`)
  },

  async getOpportunity(id: string): Promise<{ success: boolean; data?: Opportunity; error?: { code: string; message: string } }> {
    if (process.env.NODE_ENV === 'development') {
      const opp = mockOpportunities.find(o => o.id === id);
      return { success: true, data: opp };
    }
    return apiClient.get(`/opportunities/${id}`)
  },

  async createOpportunity(data: CreateOpportunityInput): Promise<{ success: boolean; data?: Opportunity; message?: string; error?: { code: string; message: string } }> {
    if (process.env.NODE_ENV === 'development') {
      const input = data as CreateOpportunityInput & {
        contact?: Opportunity['contact']
      }

      const now = new Date().toISOString()

      const newOpp: Opportunity = {
        id: Math.random().toString(36).slice(2, 11),
        title: input.title,
        description: input.description,
        value: Number(input.value) || 0,
        stage: input.stage,
        closeDate: input.closeDate,
        contact:
          input.contact ??
          ({
            id: input.contactId,
            firstName: 'Unknown',
            lastName: 'Contact',
            email: 'unknown@example.com',
          } satisfies Opportunity['contact']),
        createdBy: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
        createdAt: now,
        updatedAt: now,
      }

      mockOpportunities.unshift(newOpp)
      return { success: true, data: newOpp };
    }
    return apiClient.post('/opportunities', data)
  },

  async updateOpportunity(id: string, data: UpdateOpportunityInput): Promise<{ success: boolean; data?: Opportunity; message?: string; error?: { code: string; message: string } }> {
    if (process.env.NODE_ENV === 'development') {
      const index = mockOpportunities.findIndex((o) => o.id === id)
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Opportunity not found' } }
      }

      const existing = mockOpportunities[index]
      const patch = data as UpdateOpportunityInput & { contact?: Opportunity['contact'] }
      const updated: Opportunity = {
        ...existing,
        ...patch,
        value: patch.value !== undefined ? Number(patch.value) || 0 : existing.value,
        contact: patch.contact ?? existing.contact,
        updatedAt: new Date().toISOString(),
      }

      mockOpportunities[index] = updated
      return { success: true, data: updated };
    }
    return apiClient.put(`/opportunities/${id}`, data)
  },

  async deleteOpportunity(id: string): Promise<{ success: boolean; message?: string; error?: { code: string; message: string } }> {
    if (process.env.NODE_ENV === 'development') {
      const index = mockOpportunities.findIndex((o) => o.id === id)
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Opportunity not found' } }
      }

      mockOpportunities.splice(index, 1)
      return { success: true, message: 'Opportunity deleted' }
    }
    return apiClient.delete(`/opportunities/${id}`)
  },

  async getDashboardMetrics(): Promise<{ success: boolean; data?: DashboardMetrics; error?: { code: string; message: string } }> {
    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        data: {
          totalContacts: 45,
          totalOpportunities: mockOpportunities.length,
          totalValue: 250000,
          opportunitiesByStage: {
            'PROSPECT': 5,
            'QUALIFIED': 3,
            'PROPOSAL': 4,
            'NEGOTIATION': 2
          },
          recentOpportunities: mockOpportunities.slice(0, 5),
          pipelineValue: 185000
        }
      };
    }
    return apiClient.get('/opportunities/dashboard/metrics')
  },
}

let mockOpportunities: Opportunity[] = [
  {
    id: 'opp1',
    title: 'Enterprise Cloud Migration',
    value: 45000,
    stage: 'PROPOSAL',
    contact: { id: 'c1', firstName: 'Sarah', lastName: 'Chen', company: 'DataStream', email: 's.chen@datastream.com' },
    createdBy: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'opp2',
    title: 'Security Audit Q3',
    value: 12000,
    stage: 'QUALIFIED',
    contact: { id: 'c2', firstName: 'Michael', lastName: 'Ross', company: 'SafeGuard Bank', email: 'mross@safeguard.bank' },
    createdBy: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'opp3',
    title: 'Custom CRM Integration',
    value: 85000,
    stage: 'NEGOTIATION',
    contact: { id: 'c3', firstName: 'Alex', lastName: 'Rivers', company: 'TechFlow Inc.', email: 'alex.rivers@techflow.io' },
    createdBy: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'opp4',
    title: 'Logistics Optimization',
    value: 28000,
    stage: 'PROSPECT',
    contact: { id: 'c4', firstName: 'Emily', lastName: 'Blunt', company: 'LogiWorld', email: 'emily@logiworld.com' },
    createdBy: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
