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
import { CartItemEntity } from '../entity/CartItem.entity'

export class OrderController {
  // get one order by order id
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

  // place an order by userId
  static async placeOrder(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    const orderData = req.body.orderData
    // required data {
    //     "orderData": {
    //         "taxAmount": 20,
    //         "totalBeforeTax": 300.97,
    //         "shippingAddressId":25,
    //         "isGift": true, (required)
    //         "giftTo":"Dan", (optional)
    //         "giftFrom":"Ben"(optional),
    //         "giftMessage":"happy bday"(optional)
    //          "shippingFee" : 20, 30, etc. come from front end
    //     }
    // }
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
    const cartItemRepo = gDB.getRepository(CartItemEntity)

    try {
      const user = await userRepo.findOneOrFail({
        where: { id: +userId },
        relations: ['shoppingCart'],
      })

      if (!user) {
        return res.status(404).send(new ResponseClass(404, 'no user found'))
      }

      if (user.shoppingCart.cartItems.length === 0) {
        return res
          .status(400)
          .send(
            new ResponseClass(
              400,
              'Your shopping cart is empty, cannot place order',
            ),
          )
      }
      const shippingAddress = await addressRepo.findOneOrFail({
        where: { id: +orderData.shippingAddressId },
      })

      const order = new OrderEntity()

      order.taxAmount = orderData.taxAmount
      order.totalBeforeTax = orderData.totalBeforeTax
      order.shippingAddress = shippingAddress
      order.isGift = orderData.isGift
      order.user = user

      if (orderData.shippingFee !== undefined) {
        order.shippingFee = orderData.shippingFee
      }

      if (order.isGift) {
        order.giftFrom = orderData.giftFrom
        order.giftTo = orderData.giftTo
        order.giftMessage = orderData.giftMessage
      }

      order.calcTotal()

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
        // remove shopping cart when they placed an order
        await cartItemRepo.remove(cartItem)
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

  //   update order (just the order status: pending, paid, shipped, delivered, cancelled
  static async updateOrderStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { orderId } = req.params
    const { orderStatus } = req.body
    if (!orderId) {
      return res.status(400).send('order id required to update an order')
    }
    const orderRepo = gDB.getRepository(OrderEntity)
    try {
      const order = await orderRepo.findOneOrFail({ where: { id: +orderId } })
      if (!order) {
        return res.status(404).send(new ResponseClass(400, 'Order not found'))
      }
      order.orderStatus = orderStatus
      await orderRepo.save(order)
      return res
        .status(200)
        .send(
          new ResponseClass(
            200,
            'Order status updated successfully',
            order.orderStatus,
          ),
        )
    } catch (e) {
      return res
        .status(400)
        .send(new ResponseClass(400, 'update order status failed', e.message))
    }
  }

  static async deleteOrder(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params
    if (!orderId) {
      return res
        .status(400)
        .send(new ResponseClass(400, 'Please include an order Id to delete'))
    }
    const orderRepo = gDB.getRepository(OrderEntity)
    const orderItemRepo = gDB.getRepository(OrderItemEntity)
    try {
      const order = await orderRepo.findOneOrFail({
        where: { id: +orderId },
        relations: ['orderItems'],
      })
      if (!order) {
        return res
          .status(404)
          .send(
            new ResponseClass(404, 'no order found, check your order number'),
          )
      }
      for (const orderItem of order.orderItems) {
        await orderItemRepo.remove(orderItem)
      }
      await orderRepo.remove(order)
      return res.status(200).send(
        new ResponseClass(200, 'Order deleted successfully', {
          deletedOrder: order,
        }),
      )
    } catch (e) {
      CLog.bad('deleting order failed', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'deleting order failed', e.message))
    }
  }

  // get all orders from one user by their user id

  static async getAllOrders(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    const userRepo = gDB.getRepository(UserEntity)
    if (!userId) {
      return res
        .status(400)
        .send('Please include a user id when searching for orders')
    }
    try {
      const user = await userRepo.findOneOrFail({
        where: { id: +userId },
        relations: ['orders'],
      })
      if (!user) {
        return res
          .status(404)
          .send(
            new ResponseClass(
              404,
              'No user found by this user id, check your user id',
            ),
          )
      }
      return res.status(200).send(
        new ResponseClass(200, 'Your order info is found', {
          orders: user.orders,
        }),
      )
    } catch (e) {
      return res
        .status(400)
        .send(new ResponseClass(400, 'loading orders failed', e.message))
    }
  }
}
