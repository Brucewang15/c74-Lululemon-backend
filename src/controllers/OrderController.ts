import gDB from '../InitDataSource'
import { OrderEntity } from '../entity/Order.entity'
import { NextFunction, Request, Response } from 'express'
import { ResponseClass } from '../helper/Response'
import { CLog } from '../AppHelper'
import { UserEntity } from '../entity/User.entity'
import { ShippingAddressEntity } from '../entity/ShippingAddress.entity'
import { validate } from 'class-validator'
import { ShoppingCartEntity } from '../entity/ShoppingCart.entity'
import { OrderItemEntity } from '../entity/OrderItem.entity'
import { instanceToPlain } from 'class-transformer'

export class OrderController {
  static async getOrder(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params
    if (!orderId) {
      return res
        .status(400)
        .send(new ResponseClass(404, 'include your order id to search'))
    }
    const orderRepo = gDB.getRepository(OrderEntity)
    try {
      const order = await orderRepo.findOneOrFail({
        where: { id: +orderId },
      })
      if (!order) {
        return res.status(404).send(new ResponseClass(404, 'No order found'))
      }
      return res.status(200).send(
        new ResponseClass(200, 'Searching Order Successful', {
          order,
        }),
      )
    } catch (e) {
      CLog.bad('loading order failed', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'Loading order failed', e.message))
    }
  }

  static async placeOrder(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    const orderData = req.body.orderData
    if (!userId) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Please log in or include a user id to place an order',
          ),
        )
    }
    const userRepo = gDB.getRepository(UserEntity)
    const orderRepo = gDB.getRepository(OrderEntity)
    const addressRepo = gDB.getRepository(ShippingAddressEntity)
    const orderItemRepo = gDB.getRepository(OrderItemEntity)
    try {
      const user = await userRepo.findOneOrFail({
        where: { id: +userId },
        relations: ['shoppingCart'],
      })
      if (!user) {
        return res.status(404).send(new ResponseClass(404, 'no user found'))
      }

      const shippingAddress = await addressRepo.findOneOrFail({
        where: { id: +orderData.shippingAddressId },
      })

      const order = new OrderEntity()

      order.taxAmount = orderData.taxAmount
      order.totalBeforeTax = orderData.totalBeforeTax
      order.shippingAddress = shippingAddress
      order.isGift = orderData.isGift

      if (orderData.shippingFee !== undefined) {
        order.shippingFee = orderData.shippingFee
      }
      order.calcTotal()
      order.user = user

      if (order.isGift) {
        order.giftFrom = orderData.giftFrom
        order.giftTo = orderData.giftTo
        order.giftMessage = orderData.giftMessage
      }

      order.orderItems = []

      for (const cartItem of user.shoppingCart.cartItems) {
        const orderItem = new OrderItemEntity()
        orderItem.productId = cartItem.productId
        orderItem.colorId = cartItem.colorId
        orderItem.size = cartItem.size
        orderItem.quantity = cartItem.quantity
        orderItem.price = cartItem.price
        orderItem.image = cartItem.image
        orderItem.name = cartItem.name
        orderItem.swatchName = cartItem.swatchName
        orderItem.order = order

        await orderItemRepo.save(orderItem)

        order.orderItems.push(orderItem)
      }
      const errors = await validate(order)
      if (errors.length > 0) {
        CLog.bad('order format validation failed', errors)
        return res.status(400).send('Order format validation failed')
      }
      console.log('Saving Order:', order)

      await orderRepo.save(order)
      const sanitizedUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      }
      order.user = sanitizedUser as any
      const sanitizedOrderInfo = instanceToPlain(order)
      return res.status(200).send(
        new ResponseClass(200, 'Placed Order Successfully!', {
          order: sanitizedOrderInfo,
        }),
      )
    } catch (e) {
      CLog.bad('placing an order failed', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'Placing an order failed', e.message))
    }
  }
}
