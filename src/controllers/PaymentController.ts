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
  static async createStripePayment(req: Request, res: Response) {
    const { orderId, userId } = req.body

    const orderRepo = gDB.getRepository(OrderEntity);
    let orderToUpdate = await orderRepo.findOne({ where: { id: orderId } });

    
    const paymentRepo = gDB.getRepository(PaymentEntity)
    const newPayment = new PaymentEntity()
    newPayment.paymentStatus = PaymentStatus.PENDING
    newPayment.paymentMethod = PaymentMethod.STRIPE
    newPayment.totalAmount = orderToUpdate.totalAfterTax
    newPayment.orderId = orderId
    newPayment.userId = userId


    const savedPayment = await paymentRepo.save(newPayment);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderToUpdate.totalAfterTax * 100,
      currency: 'cad',
      payment_method_types: ["card"]
    })

    return res
      .status(200)
      .send(
        new ResponseClass(200, 'Payment Ready', {
          clientSecret: paymentIntent.client_secret,
          paymentId: savedPayment.id
        }),
      )
  }

  static async completeStripePayment(req: Request, res: Response) {
    const { orderId, userId, paymentId } = req.body

    const paymentRepo = gDB.getRepository(PaymentEntity)
    let paymentToUpdate = await paymentRepo.findOne({ where: { id: paymentId } });
    paymentToUpdate.paymentStatus = PaymentStatus.PAID

    await paymentRepo.save(paymentToUpdate);
    
    return res
      .status(200)
      .send(
        new ResponseClass(200, 'Payment Successful'),
      )
  }

  
  static async createPayment(req: Request, res: Response) {
    const { amount, orderId, userId, payType } = req.body

    if (!amount || amount <= 0 || !orderId || !userId || !payType) {
      console.log('Missing payment information in request body.')
      return res
        .status(400)
        .send('Missing payment information in request body.')
    }

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

      return res
      .status(200)
      .send(
        new ResponseClass(200, 'Payment Successful', {
          paymentId: newPayment.id,
        }),
      )

    } catch (e) {
      console.error("Payment processing failed:", e);
      return res.status(500).send("Payment processing failed.");
   }
  }
}
