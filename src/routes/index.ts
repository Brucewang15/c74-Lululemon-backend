import { Router } from 'express'
import user from './user'
import auth from './auth'
import inventory from './inventory'

const rootRouter = Router()

rootRouter.use('/user', auth)
rootRouter.use('/inv', inventory)

export default rootRouter
