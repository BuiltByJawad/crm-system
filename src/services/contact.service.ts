import { prisma } from '../config/database'
import { Contact, CreateContactRequest, UpdateContactRequest, ContactFilters, PaginationOptions, PaginatedResponse } from '../types'

export class ContactService {
  async createContact(userId: string, contactData: CreateContactRequest): Promise<Contact> {
    const contact = await prisma.contact.create({
      data: {
        ...contactData,
        createdById: userId,
      },
      include: {
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

    return contact as Contact
  }

  async getContactById(id: string): Promise<Contact | null> {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
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
        opportunities: {
          select: {
            id: true,
            title: true,
            stage: true,
            value: true,
          },
        },
      },
    })

    return contact as Contact | null
  }

  async getContacts(
    filters: ContactFilters = {},
    pagination: PaginationOptions = {},
    userId: string,
    userRole: string
  ): Promise<PaginatedResponse<Contact>> {
    const { page = 1, limit = 20 } = pagination
    const { search, assignedToId, tags, createdById } = filters

    // Build where clause
    const where: any = {}

    // Role-based filtering
    if (userRole === 'SALES_REP') {
      // Sales reps can only see their own contacts or unassigned ones
      where.OR = [
        { assignedToId: userId },
        { assignedToId: null },
        { createdById: userId },
      ]
    } else if (userRole === 'MANAGER') {
      // Managers can see all contacts
      // No additional filtering needed
    }
    // Admins can see all

    // Apply filters
    if (search) {
      where.OR = where.OR || []
      where.OR.push(
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      )
    }

    if (assignedToId) {
      where.assignedToId = assignedToId
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      }
    }

    if (createdById) {
      where.createdById = createdById
    }

    // Get total count
    const total = await prisma.contact.count({ where })

    // Get paginated results
    const contacts = await prisma.contact.findMany({
      where,
      include: {
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

    return {
      success: true,
      data: contacts as Contact[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async updateContact(id: string, updateData: UpdateContactRequest): Promise<Contact> {
    const contact = await prisma.contact.update({
      where: { id },
      data: updateData,
      include: {
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

    return contact as Contact
  }

  async deleteContact(id: string): Promise<void> {
    await prisma.contact.delete({
      where: { id },
    })
  }

  async getContactStats(userId: string, userRole: string): Promise<{
    totalContacts: number
    myContacts: number
    unassignedContacts: number
  }> {
    let whereClause: any = {}

    if (userRole === 'SALES_REP') {
      whereClause = {
        OR: [
          { assignedToId: userId },
          { createdById: userId },
        ],
      }
    }

    const [totalContacts, myContacts, unassignedContacts] = await Promise.all([
      prisma.contact.count({ where: whereClause }),
      prisma.contact.count({ where: { assignedToId: userId } }),
      prisma.contact.count({ where: { assignedToId: null } }),
    ])

    return {
      totalContacts,
      myContacts,
      unassignedContacts,
    }
  }
}
