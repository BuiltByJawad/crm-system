import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { ApiResponse } from '../types'
import { CreateUserInput, LoginInput } from '../utils/validation'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: CreateUserInput = req.body

      const user = await this.authService.register(userData)

      const response: ApiResponse = {
        success: true,
        data: user,
        message: 'User registered successfully',
      }

      res.status(201).json(response)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message,
        },
      }

      res.status(400).json(response)
    }
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginInput = req.body

      const result = await this.authService.login(email, password)

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Login successful',
      }

      res.json(response)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message,
        },
      }

      res.status(401).json(response)
    }
  }

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'Authentication required',
          },
        }
        res.status(401).json(response)
        return
      }

      const user = await this.authService.getUserById(req.user.id)

      if (!user) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        }
        res.status(404).json(response)
        return
      }

      const response: ApiResponse = {
        success: true,
        data: user,
      }

      res.json(response)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get profile'

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PROFILE_FETCH_FAILED',
          message,
        },
      }

      res.status(500).json(response)
    }
  }

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'Authentication required',
          },
        }
        res.status(401).json(response)
        return
      }

      const updateData = req.body
      const user = await this.authService.updateUser(req.user.id, updateData)

      const response: ApiResponse = {
        success: true,
        data: user,
        message: 'Profile updated successfully',
      }

      res.json(response)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile'

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PROFILE_UPDATE_FAILED',
          message,
        },
      }

      res.status(400).json(response)
    }
  }
}
