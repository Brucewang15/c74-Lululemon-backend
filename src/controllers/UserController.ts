import { Request, Response } from 'express'
import gDB from '../InitDataSource'
import { UserEntity } from '../entity/User.entity'
import { validate } from 'class-validator'
import { CLog } from '../AppHelper'

class UserController {
  static async addOne(req: Request, res: Response) {
    const db = gDB.getRepository(UserEntity)

    // create a default user
    let user = new UserEntity()

    user.email = 'aabbcc2@gmail.com'
    user.password = 'ab12cd34@2020'

    try {
      let errors = await validate(user)
      if (errors.length > 0) {
        CLog.bad('Validation failed: ', errors)
        return res.status(400).send({ 'Validation failed': errors })
      }
      user = await db.save(user)
      return res.status(201).send(`User created, ${user.email}`)
    } catch (err) {
      CLog.bad('Create a user error: ', err)
      res.status(400).send('Create a user error: ')
    }
  }
}

export default UserController
