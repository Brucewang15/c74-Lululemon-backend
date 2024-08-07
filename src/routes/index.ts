import { Router } from 'express'
import user from './user'
import auth from './auth'
import change from './change'

const rootRouter = Router()
rootRouter.use('/auth', auth)
rootRouter.use('/user', user)
rootRouter.use('/change', change)
export default rootRouter
