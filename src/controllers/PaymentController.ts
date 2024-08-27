import { Request, Response } from 'express'
import gDB from '../InitDataSource'
import {
  PaymentEntity,
  PaymentMethod,
  PaymentStatus,
} from '../entity/Payment.entity'
import paypal = require('paypal-rest-sdk')
import { OrderEntity } from '../entity/Order.entity'
import { OrderItemEntity } from '../entity/OrderItem.entity'
import { OrderStatus } from '../helper/Enum'
import { ResponseClass } from '../helper/Response'

const stripe = require('stripe')(process.env.STRIPE_API_KEY)

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
})

export class PaymentController {
  static async createPayment(req: Request, res: Response) {
    const { amount, orderId, userId, payType } = req.body

    if (!amount || amount <= 0 || !orderId || !userId || !payType) {
      console.log('Missing payment information in request body.')
      return res
        .status(400)
        .send('Missing payment information in request body.')
    }

    // const paymentTotal = amount.total
    //
    // if (!paymentTotal || paymentTotal <= 0) {
    //   return res
    //     .status(400)
    //     .send('Missing payment information in request body.')
    // }
    try {
      const paymentRepo = gDB.getRepository(PaymentEntity)
      const newPayment = new PaymentEntity()
      newPayment.paymentStatus = PaymentStatus.PAID
      if (payType == 'stripe') {
        newPayment.paymentMethod = PaymentMethod.STRIPE
      } else {
        newPayment.paymentMethod = PaymentMethod.PAYPAL
      }
      newPayment.totalAmount = amount
      newPayment.orderId = orderId
      newPayment.userId = userId

      await paymentRepo.save(newPayment)

      const orderRepo = gDB.getRepository(OrderEntity)
      let orderToUpdate = await orderRepo.findOne({ where: { id: orderId } })
      orderToUpdate.orderStatus = OrderStatus.PAID

      // console.log(newPayment)
      // console.log(orderToUpdate)

      await orderRepo.save(orderToUpdate)

      if (payType == 'stripe') {
        const orderItemRepo = gDB.getRepository(OrderItemEntity)
        const orderItems = await orderItemRepo.find({
          where: { order: { id: orderId } },
        })

        const stripeSession = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: 'cad',
                unit_amount: orderToUpdate.totalAfterTax * 100,
                tax_behavior: 'inclusive',
                product_data: {
                  name: 'Lululemon Order',
                },
              },
              adjustable_quantity: {
                enabled: false,
              },
              quantity: 1,
            },
          ],
          // orderItems.map((orderItem) => ({
          //   price_data: {
          //     currency: 'cad',
          //     product_data: {
          //       name: orderItem.name,
          //     },
          //     unit_amount: orderItem.price * 100,
          //     tax_behavior: 'inclusive',
          //   },
          //   adjustable_quantity: {
          //     enabled: false,
          //   },
          //   quantity: orderItem.quantity,
          // })),
          mode: 'payment',
          success_url: 'http://localhost:3000/shop/thankyou',
          cancel_url: 'http://localhost:3000/',
        })

        return res.status(200).send(
          new ResponseClass(200, 'Payment Successful', {
            sessionId: stripeSession.id,
          }),
        )
      } else {
        return res.status(200).send(
          new ResponseClass(200, 'Payment Successful', {
            paymentId: newPayment.id,
          }),
        )
      }
    } catch (e) {
      console.error('Payment processing failed:', e)
      return res.status(500).send('Payment processing failed.')
    }
  }
}
