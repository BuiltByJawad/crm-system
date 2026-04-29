import { apiClient } from './client'
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from '../validators'

export interface AuthResponse {
  success: boolean
  data?: {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: string
    }
    token: string
  }
  message?: string
  error?: {
    code: string
    message: string
  }
}

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const authApi = {
  async login(credentials: LoginInput): Promise<AuthResponse> {
    // Mock login for development if API is not available
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      // Detailed error messages for development testing
      if (credentials.email !== 'admin@crm.com') {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'No account found with this email address.'
          }
        };
      }
      
      if (credentials.password !== 'password123') {
        return {
          success: false,
          error: {
            code: 'WRONG_PASSWORD',
            message: 'Incorrect password. Please try again.'
          }
        };
      }

      return {
        success: true,
        data: {
          user: {
            id: '1',
            email: 'admin@crm.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'admin'
          },
          token: 'mock-token-123'
        }
      };
    }
    return apiClient.post('/auth/login', credentials)
  },

  async register(userData: RegisterInput): Promise<AuthResponse> {
    // Mock register for development
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: {
          user: {
            id: '2',
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: 'user'
          },
          token: 'mock-token-reg-123'
        }
      };
    }
    return apiClient.post('/auth/register', userData)
  },

  async getProfile(): Promise<{ success: boolean; data?: UserProfile; error?: { code: string; message: string } }> {
    return apiClient.get('/auth/profile')
  },

  async updateProfile(updateData: Partial<UserProfile>): Promise<{ success: boolean; data?: UserProfile; message?: string; error?: { code: string; message: string } }> {
    return apiClient.put('/auth/profile', updateData)
  },

  async forgotPassword(data: ForgotPasswordInput): Promise<{ success: boolean; message?: string; error?: { code: string; message: string } }> {
    return apiClient.post('/auth/forgot-password', data)
  },

  async resetPassword(data: ResetPasswordInput & { token: string }): Promise<{ success: boolean; message?: string; error?: { code: string; message: string } }> {
    return apiClient.post('/auth/reset-password', data)
  },
}
