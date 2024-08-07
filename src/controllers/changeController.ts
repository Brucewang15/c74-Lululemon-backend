import gDB from '../InitDataSource'
import { UserEntity } from '../entity/User.entity'
import { validate } from 'class-validator'
import { CLog } from '../AppHelper'
import { Request, Response } from 'express'

class changeController {
  static async change(req: Request, res: Response) {
    const db = gDB.getRepository(UserEntity)

    try {
      const data = req.body
      console.log(data)
      const user = await db.findOne({ where: { resetToken: data.resetToken } })

      if (!user) {
        return res.status(400).send('Token is invalid')
      }

      user.changePassword(data.password)
      await db.save(user)
      res.status(200).send('Token is valid')
    } catch (err) {
      res.status(401).send(`errors: ${err}`)
    }
  }
}

export default changeController
