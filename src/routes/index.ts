import user from './user'
import { Router } from 'express'
import webcam from './webcam'
import auth from './auth'
import product from './product'

const rootRouter = Router()

rootRouter.use('/user', user)
rootRouter.use('/webcam', webcam)
rootRouter.use('/auth', auth)
rootRouter.use('/product', product)

export default rootRouter
