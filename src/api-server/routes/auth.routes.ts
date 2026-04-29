import { Router } from 'express'

import { AuthController } from '../../controllers/auth.controller'
import { AuthMiddleware } from '../../middleware/auth.middleware'
import { validateBody } from '../utils/validate-body'
import { createUserSchema, loginSchema } from '../../utils/validation'

const controller = new AuthController()
const auth = new AuthMiddleware()

export const authRouter = Router()

authRouter.post('/register', validateBody(createUserSchema), controller.register)
authRouter.post('/login', validateBody(loginSchema), controller.login)
authRouter.get('/me', auth.authenticate, controller.getProfile)
authRouter.put('/me', auth.authenticate, controller.updateProfile)
