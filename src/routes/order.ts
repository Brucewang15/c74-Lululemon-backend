import { Router } from 'express'
import { OrderController } from '../controllers/OrderController'

const router = Router()

// 1. get order by order id
router.get('/:orderId', OrderController.getOrder)
// 2. place an order based on userId
router.post('/:userId', OrderController.placeOrder)
export default router
