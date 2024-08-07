import {Request, Response} from "express";
import {UserEntity} from "../entity/User.entity";
import {validate} from "class-validator";
import {CLog} from "../AppHelper";
import gDB from "../InitDataSource";
import * as jwt from 'jsonwebtoken';

export class AuthController {
    static async signUp(req: Request, res: Response) {
        const {email, password} = req.body

        if (!(email && password)) {
            return res.status(400).send('Invalid email or password.')
        }

        const db = gDB.getRepository(UserEntity)

        let user = new UserEntity()
        user.email = email
        user.password = password

        user.hashPassword()

        try {
            const error = await validate(user, {groups: ['signUp']})
            if (error.length > 0) {
                CLog.bad("Validation failed: ", error)
                return res.status(400).send({
                    "Validation failed: ": error
                })
            }
            user = await db.save(user)

            return res.status(201).send(`User info, ${user.id}, ${user.email}, ${user.password}`)
        } catch (err) {
            CLog.bad("Sign up failed: ", err)
            res.status(400).send("Sign up failed.")
        }
    }
}