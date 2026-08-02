import { Router } from 'express'
import createUser from './create-user.js'
import login from './login.js'

/**
 * Routes for auth-related paths (`/auth/...`). Mounted under /v1 in app.ts,
 * alongside eventsRouter and organizationsRouter.
 */
export const authRouter = Router()

authRouter.use(createUser)
authRouter.use(login)