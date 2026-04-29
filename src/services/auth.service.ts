import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database'
import { User, CreateUserRequest } from '../types'

export class AuthService {
  private readonly jwtSecret: string
  private readonly jwtExpiresIn: string

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key'
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h'
  }

  async register(userData: CreateUserRequest): Promise<User> {
    const { email, password, firstName, lastName, role } = userData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'SALES_REP',
      },
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    // Generate JWT token
    const token = this.generateToken(user.id)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword as User,
      token,
    }
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return null
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }

  async updateUser(id: string, updateData: Partial<CreateUserRequest>): Promise<User> {
    const { password, ...otherData } = updateData

    let hashedPassword
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12)
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...otherData,
        ...(hashedPassword && { password: hashedPassword }),
      },
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }

  async deactivateUser(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    })
  }

  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn } as any
    )
  }

  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string }
      return decoded
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}
