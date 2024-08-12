import { Router } from 'express'
import user from './user'
import auth from './auth'
import change from './change'
import inventory from './inventory'
import imageAI from './imageAI'

const rootRouter = Router()
rootRouter.use('/auth', auth)
rootRouter.use('/user', user)
rootRouter.use('/change', change)

rootRouter.use('/inv', inventory)
rootRouter.use('/image-ai', imageAI)

export default rootRouter
