import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        firstName: string
        lastName: string
        role: string
      }
    }
  }
}

export class AuthMiddleware {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'Authentication token required',
          },
        })
        return
      }

      const token = authHeader.substring(7) // Remove 'Bearer ' prefix

      // Verify token
      const decoded = this.authService.verifyToken(token)

      // Get user details
      const user = await this.authService.getUserById(decoded.userId)

      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        })
        return
      }

      if (!user.isActive) {
        res.status(401).json({
          success: false,
          error: {
            code: 'USER_INACTIVE',
            message: 'User account is deactivated',
          },
        })
        return
      }

      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }

      next()
    } catch (error) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired authentication token',
        },
      })
    }
  }

  authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'Authentication required',
          },
        })
        return
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_PERMISSIONS',
            message: 'Insufficient permissions to access this resource',
          },
        })
        return
      }

      next()
    }
  }

  requireOwnershipOrAdmin = (resourceUserId: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'Authentication required',
          },
        })
        return
      }

      // Admins can access everything
      if (req.user.role === 'ADMIN') {
        next()
        return
      }

      // Users can access their own resources
      if (req.user.id === resourceUserId) {
        next()
        return
      }

      // Managers can access resources they created or that are assigned to their team
      // (This would need to be extended based on business logic)
      if (req.user.role === 'MANAGER') {
        next()
        return
      }

      res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'You can only access your own resources',
        },
      })
    }
  }
}
