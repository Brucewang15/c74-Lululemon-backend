import gDB from '../InitDataSource'
import { UserEntity } from '../entity/User.entity'
import { NextFunction, Request, Response } from 'express'
import { validate } from 'class-validator'
import * as jwt from 'jsonwebtoken'
import { CLog } from '../AppHelper'

import { ShippingAddressEntity }from '../entity/ShippingAddress.entity'
class CheckoutController {

    //get all checkout shipping address
    static async getAllShippingAddress(req: Request, res: Response, next: NextFunction)  {
        const db = gDB.getRepository(ShippingAddressEntity)

        try {
            const allAddress = await db.find()

            return res.status(201).send(JSON.stringify(allAddress, null, 1))

        }
        catch(err) {
            res.status(401).send(`error ${err}`)
        }
    }
}


export default CheckoutController