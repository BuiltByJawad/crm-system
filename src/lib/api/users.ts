import { apiClient } from './client'
import { UpdateUserInput } from '../validators'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'MANAGER' | 'SALES_REP'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PaginatedUsers {
  success: boolean
  data: User[]
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

export const usersApi = {
  async getUsers(filters?: {
    search?: string
    role?: string
    page?: number
    limit?: number
  }): Promise<PaginatedUsers> {
    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }
    const query = queryParams.toString()
    return apiClient.get(`/users${query ? `?${query}` : ''}`)
  },

  async getUser(id: string): Promise<{ success: boolean; data?: User; error?: { code: string; message: string } }> {
    return apiClient.get(`/users/${id}`)
  },

  async updateUser(id: string, data: UpdateUserInput): Promise<{ success: boolean; data?: User; message?: string; error?: { code: string; message: string } }> {
    return apiClient.put(`/users/${id}`, data)
  },

  async deleteUser(id: string): Promise<{ success: boolean; message?: string; error?: { code: string; message: string } }> {
    return apiClient.delete(`/users/${id}`)
  },
}
