import { Router } from 'express'
import invoice from './invoice'
import user from './user'
import auth from './auth'
import change from './change'
import inventory from './inventory'
import cart from './cart'
import imageAI from './imageAI'
import openAI from './openAI'
import payment from './payment'
import order from './order'
import authMiddleware from '../middleware/jwt.middleware'
import wishlist from "./wishlist";

const rootRouter = Router()
rootRouter.use('/auth', auth)
rootRouter.use('/user', authMiddleware, user)
rootRouter.use('/change', authMiddleware, change)
rootRouter.use('/inv', inventory)
rootRouter.use('/cart', authMiddleware, cart)
rootRouter.use('/image-ai', imageAI)
rootRouter.use('/openAI', openAI)
rootRouter.use('/payment', authMiddleware, payment)
rootRouter.use('/order', authMiddleware, order)
rootRouter.use('/invoice', invoice)
rootRouter.use('/wishlist', authMiddleware, wishlist)

export default rootRouter
