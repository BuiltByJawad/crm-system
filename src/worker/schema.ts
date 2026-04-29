import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role', { enum: ['ADMIN', 'MANAGER', 'SALES_REP'] }).notNull().default('SALES_REP'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

export const contacts = sqliteTable('contacts', {
  id: text('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  company: text('company'),
  email: text('email').unique(),
  phone: text('phone'),
  address: text('address'),
  notes: text('notes'),
  tags: text('tags'),
  createdById: text('created_by_id').notNull().references(() => users.id),
  assignedToId: text('assigned_to_id').references(() => users.id),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

export const opportunities = sqliteTable('opportunities', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  value: text('value'),
  currency: text('currency').notNull().default('USD'),
  stage: text('stage', { enum: ['PROSPECT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'] }).notNull(),
  probability: integer('probability').default(0),
  closeDate: text('close_date'),
  contactId: text('contact_id').notNull().references(() => contacts.id),
  createdById: text('created_by_id').notNull().references(() => users.id),
  assignedToId: text('assigned_to_id').references(() => users.id),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

export const opportunityHistory = sqliteTable('opportunity_history', {
  id: text('id').primaryKey(),
  opportunityId: text('opportunity_id').notNull().references(() => opportunities.id),
  previousStage: text('previous_stage', { enum: ['PROSPECT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'] }),
  newStage: text('new_stage', { enum: ['PROSPECT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'] }).notNull(),
  changeReason: text('change_reason'),
  changedById: text('changed_by_id').notNull().references(() => users.id),
  changedAt: text('changed_at').notNull().default(sql`(datetime('now'))`),
})
