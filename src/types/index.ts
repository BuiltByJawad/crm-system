import { UserRole, OpportunityStage } from '@prisma/client'

// User types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Contact types
export interface Contact {
  id: string
  firstName: string
  lastName: string
  company?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  tags: string[]
  createdById: string
  assignedToId?: string
  createdAt: Date
  updatedAt: Date
  createdBy?: User
  assignedTo?: User
}

export interface CreateContactRequest {
  firstName: string
  lastName: string
  company?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  tags?: string[]
  assignedToId?: string
}

export interface UpdateContactRequest {
  firstName?: string
  lastName?: string
  company?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  tags?: string[]
  assignedToId?: string
}

// Opportunity types
export interface Opportunity {
  id: string
  title: string
  description?: string
  value?: number
  currency: string
  stage: OpportunityStage
  probability?: number
  closeDate?: Date
  contactId: string
  createdById: string
  assignedToId?: string
  createdAt: Date
  updatedAt: Date
  contact?: Contact
  createdBy?: User
  assignedTo?: User
}

export interface CreateOpportunityRequest {
  title: string
  description?: string
  value?: number
  currency?: string
  stage: OpportunityStage
  probability?: number
  closeDate?: string
  contactId: string
  assignedToId?: string
}

export interface UpdateOpportunityRequest {
  title?: string
  description?: string
  value?: number
  currency?: string
  stage?: OpportunityStage
  probability?: number
  closeDate?: string
  assignedToId?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Pagination types
export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filter types
export interface ContactFilters {
  search?: string
  assignedToId?: string
  tags?: string[]
  createdById?: string
}

export interface OpportunityFilters {
  search?: string
  stage?: OpportunityStage
  assignedToId?: string
  contactId?: string
  minValue?: number
  maxValue?: number
  closeDateFrom?: string
  closeDateTo?: string
}

// Dashboard types
export interface DashboardMetrics {
  totalContacts: number
  totalOpportunities: number
  totalValue: number
  opportunitiesByStage: Record<OpportunityStage, number>
  recentOpportunities: Opportunity[]
  pipelineValue: number
}

// File upload types
export interface FileUpload {
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedAt: Date
}
