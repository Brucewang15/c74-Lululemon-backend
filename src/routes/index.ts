import { Router } from 'express'
import user from './user'
import auth from './auth'

const rootRouter = Router()

rootRouter.use('/auth', auth)

export default rootRouter
