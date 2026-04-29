import { z } from 'zod'

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['ADMIN', 'MANAGER', 'SALES_REP']).optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

// Contact validation schemas
export const createContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  assignedToId: z.string().optional(),
})

export const updateContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  company: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  assignedToId: z.string().optional(),
})

// Opportunity validation schemas
export const createOpportunitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  value: z.number().positive('Value must be positive').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').optional(),
  stage: z.enum(['PROSPECT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']),
  probability: z.number().min(0).max(100).optional(),
  closeDate: z.string().optional(),
  contactId: z.string().min(1, 'Contact ID is required'),
  assignedToId: z.string().optional(),
})

export const updateOpportunitySchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  value: z.number().positive('Value must be positive').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').optional(),
  stage: z.enum(['PROSPECT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']).optional(),
  probability: z.number().min(0).max(100).optional(),
  closeDate: z.string().optional(),
  assignedToId: z.string().optional(),
})

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.string().transform(val => parseInt(val)).refine(val => val > 0, 'Page must be positive').optional(),
  limit: z.string().transform(val => parseInt(val)).refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100').optional(),
})

export const contactFiltersSchema = z.object({
  search: z.string().optional(),
  assignedToId: z.string().optional(),
  tags: z.string().transform(val => val.split(',')).optional(),
  createdById: z.string().optional(),
})

export const opportunityFiltersSchema = z.object({
  search: z.string().optional(),
  stage: z.enum(['PROSPECT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']).optional(),
  assignedToId: z.string().optional(),
  contactId: z.string().optional(),
  minValue: z.string().transform(val => parseFloat(val)).optional(),
  maxValue: z.string().transform(val => parseFloat(val)).optional(),
  closeDateFrom: z.string().optional(),
  closeDateTo: z.string().optional(),
})

// Type exports for use in controllers
export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateContactInput = z.infer<typeof createContactSchema>
export type UpdateContactInput = z.infer<typeof updateContactSchema>
export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>
export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type ContactFiltersInput = z.infer<typeof contactFiltersSchema>
export type OpportunityFiltersInput = z.infer<typeof opportunityFiltersSchema>
