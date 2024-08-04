import { Request, Response } from 'express'
import gDB from '../InitDataSource'
import { UserEntity } from '../entity/User.entity'
import { validate } from 'class-validator'
import { CLog } from '../AppHelper'

class UserController {
  static db = gDB.getRepository(UserEntity)

  static async addOne(req: Request, res: Response) {
    const { firstName, lastName, age, email, password, gender } = req.body
    //     create a default user
    let user: UserEntity = new UserEntity()
    user.firstName = firstName
    user.lastName = lastName
    user.age = age
    user.email = email
    user.password = password
    user.gender = gender

    // user.firstName = 'Kevin'
    // user.lastName = 'Maas'
    // user.age = 20
    // user.email = 'aabbcc@gmail.com'
    // user.password = 'ab12cd34@2020'

    try {
      let errors = await validate(user)
      if (errors.length > 0) {
        CLog.bad('validation failed', errors)
        return res.status(400).send('Validation failed') //商业项目不可以把原生错误给客户
      }
      user.hashPassword()
      user = await UserController.db.save(user)
      console.log(user)
      return res
        .status(200)
        .send(
          `User has been created!' User ID: ${user.id} Info Summary: ${JSON.stringify(user)}`,
        )
    } catch (e) {
      CLog.bad('validation failed', e)
      return res.status(400).send('Create a user error') //商业项目不可以把原生错误给客户
    }
  }

  static async allUsers(req: Request, res: Response) {
    let users = []
    try {
      users = await UserController.db.find()
      return res.status(200).send({ message: 'Users in the database', users })
    } catch (e) {
      return res
        .status(400)
        .send({ 'error msg': 'We are not able to list all users', error: e })
    }
  }

  static async findOneUser(req: Request, res: Response) {
    const { userId } = req.params
    let user = null
    if (!userId) {
      return res
        .status(400)
        .send('please include the userId you want to look up')
    }
    try {
      const id = +userId
      if (isNaN(id)) {
        return res.status(400).send('please enter a number for user id')
      }
      user = await UserController.db.findOneOrFail({
        where: {
          id: id,
        },
      })
      return res
        .status(200)
        .send({ msg: 'here is the user you serached', user })
    } catch (e) {
      return res
        .status(404)
        .send('We cannot find the user, enter the correct user ID')
    }
  }

  static async updateUser(req: Request, res: Response) {
    const { userId } = req.params
    const { firstName, lastName, age, email, password, gender } = req.body
    const id = +userId
    let user = null
    let userOld = null
    // Check if there is userId
    if (!userId) {
      return res
        .status(400)
        .send('please include the userId you want to look up')
    }
    // Find the user in the database
    try {
      user = await UserController.db.findOneOrFail({ where: { id: id } })
      // save the old data in userOld so to display the change
      userOld = await UserController.db.findOneOrFail({ where: { id } })
      // Validate the inputs
    } catch (e) {
      return res.status(404).send('We cannot find the user you searched by id')
    }
    // Update the userinfo
    user.firstName = firstName
    user.lastName = lastName
    user.age = age
    user.email = email
    user.password = password
    user.gender = gender

    // Validate the inputs
    const errors = await validate(user)
    if (errors.length > 1) {
      return res.send(
        'The information you tried to update is incorrect, check again',
      )
    }
    // Save the updated information to the database
    try {
      await UserController.db.save(user)
      return res.status(200).send({
        'User updated successfully': user,
        'Old user information was:': userOld,
      })
    } catch (e) {
      return res.status(400).send({ 'Failed updating user info': e })
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const { userId } = req.params
    const id = +userId
    let user = null

    if (!userId) {
      return res.status(400).send('Please enter a user id to delete this user')
    }

    try {
      user = await UserController.db.findOneOrFail({ where: { id: id } })
      await UserController.db.delete(user)
      return res
        .status(200)
        .send({ 'user deleted successfully, user you deleted was': user })
    } catch (e) {
      return res
        .status(400)
        .send('Failed deleting the user, check your user id or try again')
    }
  }
}

export default UserController
