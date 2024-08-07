import { Router } from 'express'
import user from './user'
import auth from './auth'

const rootRouter = Router()

rootRouter.use('/user', auth)

export default rootRouter
