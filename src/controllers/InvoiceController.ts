import { NextFunction, Request, Response } from 'express'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { ResponseClass } from '../helper/Response'
import { CLog } from '../AppHelper'
import gDB from '../InitDataSource'
import { OrderEntity } from '../entity/Order.entity'
import * as PDFKit from 'pdfkit'

export class InvoiceController {
  static async generateInvoice(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { orderId } = req.params
    if (!orderId) {
      return res.send(new ResponseClass(400, 'No order Id found'))
    }

    const orderRepo = gDB.getRepository(OrderEntity)
    let order

    try {
      order = await orderRepo.findOneOrFail({
        where: { id: +orderId },
      })

      if (!order) {
        return res
          .status(404)
          .send(
            new ResponseClass(404, 'Cannot find the order by this order Id'),
          )
      }
    } catch (e) {
      return res
        .status(400)
        .send(new ResponseClass(400, 'Find Order failed', e.message))
    }

    if (!order.shippingAddress) {
      return res
        .status(400)
        .send(
          new ResponseClass(400, 'No shipping address found for this order'),
        )
    }

    try {
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([600, 700])

      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

      const { width, height } = page.getSize()
      const fontSize = 12

      // Set invoice title
      page.drawText('Invoice', {
        x: 50,
        y: height - 50,
        size: 24,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      // Set company information
      page.drawText('Sample Corp', {
        x: 50,
        y: height - 100,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })
      page.drawText('Sample Street 123', {
        x: 50,
        y: height - 120,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      // Set client information
      page.drawText('Bill To:', {
        x: 50,
        y: height - 160,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })
      page.drawText(` ${order.shippingAddress.id}`, {
        x: 50,
        y: height - 180,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })
      page.drawText(`${order.shippingAddress.address}`, {
        x: 50,
        y: height - 200,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })
      page.drawText(
        `${order.shippingAddress.city}, ${order.shippingAddress.province}`,
        {
          x: 50,
          y: height - 220,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        },
      )
      page.drawText(
        `${order.shippingAddress.country}, ${order.shippingAddress.postalCode}`,
        {
          x: 50,
          y: height - 240,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        },
      )
      page.drawText(`Phone: ${order.shippingAddress.phoneNumber}`, {
        x: 50,
        y: height - 260,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      // Add gift message if any
      if (order.isGift) {
        page.drawText(`Gift From: ${order.giftFrom}`, {
          x: 50,
          y: height - 280,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })
        page.drawText(`Gift To: ${order.giftTo}`, {
          x: 50,
          y: height - 300,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })
        page.drawText(`Message: ${order.giftMessage}`, {
          x: 50,
          y: height - 320,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })
      }

      // Add order details header
      page.drawText('Order Details:', {
        x: 50,
        y: height - 350,
        size: 16,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      let currentY = height - 380

      // Add order items
      for (const item of order.orderItems) {
        page.drawText(`Product: ${item.name}`, {
          x: 50,
          y: currentY,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })
        page.drawText(`Color: ${item.swatchName}`, {
          x: 50,
          y: currentY - 20,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })
        page.drawText(`Size: ${item.size}`, {
          x: 50,
          y: currentY - 40,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })
        page.drawText(`Quantity: ${item.quantity}`, {
          x: 50,
          y: currentY - 60,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })
        page.drawText(`Price: $${item.price.toFixed(2)}`, {
          x: 50,
          y: currentY - 80,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })

        currentY -= 100
      }

      // Add total prices
      page.drawText(`Total Before Tax: $${order.totalBeforeTax.toFixed(2)}`, {
        x: 50,
        y: currentY - 20,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })
      page.drawText(`Tax Amount: $${order.taxAmount.toFixed(2)}`, {
        x: 50,
        y: currentY - 40,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })
      page.drawText(`Shipping Fee: $${order.shippingFee.toFixed(2)}`, {
        x: 50,
        y: currentY - 60,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })
      page.drawText(`Total After Tax: $${order.totalAfterTax.toFixed(2)}`, {
        x: 50,
        y: currentY - 80,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save()

      // Send the PDF to the client
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf')
      res.status(200).send(Buffer.from(pdfBytes))
    } catch (e) {
      CLog.bad('generating invoice failed', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'generating invoice failed', e.message))
    }
  }

  static async sampleInvoice(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params

    // 在这里，你应该根据 orderId 从数据库中获取订单数据
    // 为了简单起见，我们将使用一个假数据示例
    const order = {
      id: orderId,
      taxAmount: 37.18,
      totalBeforeTax: 286,
      totalAfterTax: 323.18,
      shippingFee: 0,
      orderStatus: 'pending',
      orderItems: [
        {
          id: 1,
          name: 'Groove Super-High-Rise Flared Pant Nulu',
          quantity: 1,
          price: 128,
          swatchName: 'Tidewater Teal',
        },
        {
          id: 2,
          name: 'New Venture Trouser Pique Fabric',
          quantity: 1,
          price: 158,
          swatchName: 'Black',
        },
      ],
      shippingAddress: {
        firstName: 'Jack',
        lastName: 'Ma',
        phoneNumber: '7783333333',
        address: '1800 Sheppard Avenue East',
        city: 'Toronto',
        province: 'Ontario',
        country: 'Canada',
        postalCode: 'M2J 5A7',
      },
    }

    try {
      // 创建一个新的 PDF 文档
      const doc = new PDFKit({ margin: 50 })

      // 设置响应类型和头部信息
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=invoice_${orderId}.pdf`,
      )

      // 将 PDF 流直接管道到响应对象
      doc.pipe(res)

      // 添加订单标题
      doc.fontSize(20).text('Invoice', { align: 'center' })

      // 添加客户信息
      doc
        .moveDown()
        .fontSize(12)
        .text(
          `Bill To: ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        )
      doc.text(order.shippingAddress.address)
      doc.text(
        `${order.shippingAddress.city}, ${order.shippingAddress.province}, ${order.shippingAddress.postalCode}`,
      )
      doc.text(order.shippingAddress.country)

      // 添加订单详情
      doc.moveDown().fontSize(14).text('Order Details:', { underline: true })
      order.orderItems.forEach((item, index) => {
        doc
          .moveDown()
          .fontSize(12)
          .text(`Item ${index + 1}: ${item.name}`)
        doc.text(`Quantity: ${item.quantity}`)
        doc.text(`Price: $${item.price.toFixed(2)}`)
        doc.text(`Color: ${item.swatchName}`)
      })

      // 添加订单总结
      doc
        .moveDown()
        .fontSize(12)
        .text(`Total Before Tax: $${order.totalBeforeTax.toFixed(2)}`)
      doc.text(`Tax Amount: $${order.taxAmount.toFixed(2)}`)
      doc.text(`Shipping Fee: $${order.shippingFee.toFixed(2)}`)
      doc.text(`Total After Tax: $${order.totalAfterTax.toFixed(2)}`)

      // 结束 PDF 文档
      doc.end()
    } catch (error) {
      res.status(500).send('Error generating invoice')
    }
  }

  static generateHeader(doc) {
    doc
      .image('logo.png', 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(20)
      .text('ACME Inc.', 110, 57)
      .fontSize(10)
      .text('123 Main Street', 200, 65, { align: 'right' })
      .text('New York, NY, 10025', 200, 80, { align: 'right' })
      .moveDown()
  }

  static generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        'Payment is due within 15 days. Thank you for your business.',
        50,
        780,
        { align: 'center', width: 500 },
      )
  }
}
