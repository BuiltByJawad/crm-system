import { apiClient } from './client'
import { CreateContactInput, UpdateContactInput } from '../validators'

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  assignedTo?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  createdBy: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface PaginatedContacts {
  success: boolean
  data: Contact[]
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

export const contactsApi = {
  async getContacts(filters?: {
    search?: string
    assignedToId?: string
    company?: string
    page?: number
    limit?: number
  }): Promise<PaginatedContacts> {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        success: true,
        data: mockContacts,
        pagination: {
          page: 1,
          limit: 100,
          total: mockContacts.length,
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
    return apiClient.get(`/contacts${query ? `?${query}` : ''}`)
  },

  async getContact(id: string): Promise<{ success: boolean; data?: Contact; error?: { code: string; message: string } }> {
    if (process.env.NODE_ENV === 'development') {
      const contact = mockContacts.find(c => c.id === id);
      return { success: true, data: contact };
    }
    return apiClient.get(`/contacts/${id}`)
  },

  async createContact(data: CreateContactInput): Promise<{ success: boolean; data?: Contact; message?: string; error?: { code: string; message: string } }> {
    if (process.env.NODE_ENV === 'development') {
      const newContact: Contact = {
        ...data,
        id: Math.random().toString(36).substring(2, 11),
        createdBy: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any;
      mockContacts.unshift(newContact);
      return { success: true, data: newContact };
    }
    return apiClient.post('/contacts', data)
  },

  async updateContact(id: string, data: UpdateContactInput): Promise<{ success: boolean; data?: Contact; message?: string; error?: { code: string; message: string } }> {
    if (process.env.NODE_ENV === 'development') {
      const index = mockContacts.findIndex(c => c.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Contact not found' } };
      }
      const updatedContact = {
        ...mockContacts[index],
        ...data,
        updatedAt: new Date().toISOString(),
      } as Contact;
      mockContacts[index] = updatedContact;
      return { success: true, data: updatedContact };
    }
    return apiClient.put(`/contacts/${id}`, data)
  },

  async deleteContact(id: string): Promise<{ success: boolean; message?: string; error?: { code: string; message: string } }> {
    if (process.env.NODE_ENV === 'development') {
      const index = mockContacts.findIndex(c => c.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Contact not found' } };
      }
      mockContacts.splice(index, 1);
      return { success: true, message: 'Contact deleted' };
    }
    return apiClient.delete(`/contacts/${id}`)
  },
}

let mockContacts: Contact[] = [
  {
    id: 'c1',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 's.chen@datastream.com',
    phone: '+1 (555) 123-4567',
    company: 'DataStream',
    assignedTo: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
    createdBy: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c2',
    firstName: 'Michael',
    lastName: 'Ross',
    email: 'mross@safeguard.bank',
    phone: '+1 (555) 987-6543',
    company: 'SafeGuard Bank',
    assignedTo: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
    createdBy: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c3',
    firstName: 'Alex',
    lastName: 'Rivers',
    email: 'alex.rivers@techflow.io',
    phone: '+1 (555) 444-5555',
    company: 'TechFlow Inc.',
    assignedTo: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
    createdBy: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c4',
    firstName: 'Emily',
    lastName: 'Blunt',
    email: 'emily@logiworld.com',
    phone: '+1 (555) 222-3333',
    company: 'LogiWorld',
    assignedTo: { id: 'u2', firstName: 'Jane', lastName: 'Smith', email: 'jane@crm.com' },
    createdBy: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
