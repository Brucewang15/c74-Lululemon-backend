import { NextFunction, Request, Response } from 'express'
import gDB from '../InitDataSource'
import { UserEntity } from '../entity/User.entity'
import { CLog } from '../AppHelper'
import { validate } from 'class-validator'
import { ShippingAddressEntity } from '../entity/ShippingAddress.entity'
import { HttpCode, ResponseClass } from '../helper/Response'
import * as bcrypt from 'bcrypt'

interface AuthRequest extends Request {
  userId?: number
}

class UserController {
  // find user basic info API
  static async findUserInfo(req: Request, res: Response, next: NextFunction) {
    const userDB = gDB.getRepository(UserEntity)
    const { userId } = req.params
    const userIdNum = +userId
    let user = null
    if (!userId) {
      return res
        .status(400)
        .send(
          new ResponseClass(400, 'Please Enter UserId to search for this user'),
        )
    }

    try {
      if (isNaN(userIdNum)) {
        return res
          .status(400)
          .send(new ResponseClass(400, 'Please enter a User ID (number)'))
      }
      user = await userDB.findOneOrFail({
        where: { id: userIdNum },
        relations: ['shoppingCart', 'shippingAddresses'],
      })
      const userBasicInfo = { ...user }
      delete userBasicInfo.password
      if (userBasicInfo.resetToken !== null) {
        delete userBasicInfo.resetToken
      }
      delete userBasicInfo.age
      return res
        .status(200)
        .send(
          new ResponseClass(
            200,
            'User info retrieved successfully',
            userBasicInfo,
          ),
        )
    } catch (e) {
      CLog.bad('Finding user failed', e)
      return res.status(400).send(new ResponseClass(400, 'Failed finding user'))
    }
  }

  // edit user info
  static async updateUserInfo(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    const { firstName, lastName, email, gender, age } = req.body
    if (!userId) {
      return res
        .status(400)
        .send(new ResponseClass(400, 'We cannot find the user'))
    }
    const userRepo = gDB.getRepository(UserEntity)
    try {
      let user = await userRepo.findOneOrFail({
        where: { id: +userId },
        relations: ['shoppingCart', 'shippingAddresses'],
      })
      if (firstName !== undefined) user.firstName = firstName
      if (lastName !== undefined) user.lastName = lastName
      if (email !== undefined && email !== user.email) user.email = email
      if (gender !== undefined) user.gender = gender
      if (age !== undefined && age !== null) user.age = age

      const errors = await validate(user)
      if (errors.length > 0) {
        CLog.bad('information wrong:', errors)
        return res
          .status(400)
          .send(
            new ResponseClass(
              400,
              'Ensure the information format meets the requirements',
            ),
          )
      }

      await userRepo.save(user)
      const sanitizedUserInfo = { ...user }
      delete sanitizedUserInfo.password
      delete sanitizedUserInfo.resetToken

      return res.status(200).send(
        new ResponseClass(200, 'Update user info successfully', {
          userInfo: sanitizedUserInfo,
        }),
      )
    } catch (e) {
      CLog.bad('Update user basic info failed', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'Update user basic info failed'))
    }
  }

  // find user shipping addresses
  static async getAddress(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    if (!userId) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Please enter a userId to search for the address',
          ),
        )
    }
    let user = null
    try {
      const db = gDB.getRepository(UserEntity)
      const id = +userId
      user = await db.findOneOrFail({
        where: { id: id },
        relations: ['shippingAddresses'],
      })

      return res
        .status(200)
        .send(
          new ResponseClass(
            200,
            "User's shipping addresses retrieved successfully",
            { userId: user.id, shippingAddress: user.shippingAddresses },
          ),
        )
    } catch (e) {
      CLog.bad('shipping address failed finding:', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'We cannot retrieve shipping address'))
    }
  }

  // add user's shipping address

  static async addAddress(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    const id = +userId
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      province,
      postalCode,
      city,
      country,
    } = req.body

    if (!userId) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Please include a correct userID to search for address',
          ),
        )
    }

    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !address ||
      !province ||
      !postalCode ||
      !city ||
      !country
    ) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Please enter all required fields to add a new address',
          ),
        )
    }

    let newAddress = new ShippingAddressEntity()
    newAddress.address = address
    newAddress.firstName = firstName
    newAddress.lastName = lastName
    newAddress.province = province
    newAddress.postalCode = postalCode
    newAddress.phoneNumber = phoneNumber
    newAddress.city = city
    newAddress.country = country
    let user = null

    console.log(newAddress)

    try {
      const errors = await validate(newAddress)
      if (errors.length > 0) {
        CLog.bad('validation new shipping address failed:', errors)
        return res
          .status(400)
          .send(
            new ResponseClass(
              400,
              'Please enter all required fields to add a new address',
            ),
          )
      }
      const userRepo = gDB.getRepository(UserEntity)
      user = await userRepo.findOneOrFail({
        where: { id: id },
        relations: ['shippingAddresses'],
      })
      user.shippingAddresses.push(newAddress)
      await userRepo.save(user)
      await gDB.getRepository(ShippingAddressEntity).save(newAddress)
      return res.status(200).send(
        new ResponseClass(200, 'Shipping Address Added Successfully', {
          userId: user.id,
          shippingAddress: user.shippingAddresses,
          newAddress: newAddress,
        }),
      )
    } catch (e) {
      CLog.bad('Adding user shipping address failed:', e)
      return res
        .status(400)
        .send(new ResponseClass(HttpCode.E400, 'Adding a new address failed'))
    }
  }

  // delete a user's shipping address
  static async deleteAddress(req: Request, res: Response, next: NextFunction) {
    const { userId, addressId } = req.params
    if (!(userId && addressId)) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            HttpCode.E400,
            'Please include both user id and address id to delete an address',
          ),
        )
    }
    const userIdNum = +userId
    const addressIdNum = +addressId
    let user = null
    let address = null
    const userRepo = gDB.getRepository(UserEntity)
    const addressRepo = gDB.getRepository(ShippingAddressEntity)
    try {
      user = await userRepo.findOneOrFail({
        where: { id: userIdNum },
        relations: ['shippingAddresses'],
      })
      address = await addressRepo.findOneOrFail({
        where: { id: addressIdNum },
      })
      user.shippingAddresses = user.shippingAddresses.filter(
        (ad) => ad.id !== addressIdNum,
      )

      await addressRepo.delete(address)
      await userRepo.save(user)
      return res.status(200).send(
        new ResponseClass(HttpCode.E200, 'Address deleted successfully', {
          userId: user.id,
          shippingAddress: user.shippingAddresses,
        }),
      )
    } catch (e) {
      CLog.bad('Deleting address error', e)
      return res
        .status(400)
        .send(new ResponseClass(HttpCode.E400, 'Deleting address failed'))
    }
  }

  // Update user address

  static async updateAddress(req: Request, res: Response, next: NextFunction) {
    const { userId, addressId } = req.params
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      province,
      postalCode,
      city,
      country,
    } = req.body

    if (!(userId && addressId)) {
      return res
        .status(400)
        .send(
          'Please include both user id and address id to update your address',
        )
    }
    const userIdNum = +userId
    const addressIdNum = +addressId
    let user = null
    let existingAddress = null
    const userRepo = gDB.getRepository(UserEntity)
    const addressRepo = gDB.getRepository(ShippingAddressEntity)

    try {
      user = await userRepo.findOneOrFail({
        where: { id: userIdNum },
        relations: ['shippingAddresses'],
      })
      existingAddress = await addressRepo.findOneOrFail({
        where: { id: addressIdNum },
      })
      // verify if this user has the address we are looking for
      if (!user.shippingAddresses.some((ad) => ad.id === existingAddress.id)) {
        CLog.bad('We cannot find this shipping addres in this user profile')
        return res
          .status(404)
          .send(
            new ResponseClass(
              404,
              'We cannot find this shipping address in this user profile',
            ),
          )
      }
      //Update the address we found
      if (firstName !== undefined) existingAddress.firstName = firstName
      if (lastName !== undefined) existingAddress.lastName = lastName
      if (province !== undefined) existingAddress.province = province
      if (phoneNumber !== undefined) existingAddress.phoneNumber = phoneNumber
      if (address !== undefined) existingAddress.address = address
      if (city !== undefined) existingAddress.city = city
      if (postalCode !== undefined) existingAddress.postalCode = postalCode
      if (country !== undefined) existingAddress.country = country

      const errors = await validate(existingAddress)

      if (errors.length > 0) {
        return res
          .status(400)
          .send(
            new ResponseClass(
              400,
              'Information validation failed, make sure each of your input meet the requirements',
              errors,
            ),
          )
      }
      await addressRepo.save(existingAddress)
    } catch (e) {
      CLog.bad('update address failed', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'Address updated failed, try again'))
    }
    return res.status(200).send(
      new ResponseClass(200, 'Address update successfully', {
        updatedAddress: existingAddress,
        userId: user.id,
      }),
    )
  }

  static async updatePassword(req: AuthRequest, res: Response) {
    const { currentPassword, newPassword } = req.body
    const userId = req.userId

    if (!(currentPassword && newPassword)) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Current password and new password are required.',
          ),
        )
    }

    const userRepository = gDB.getRepository(UserEntity)

    try {
      const user = await userRepository.findOneOrFail({
        where: { id: userId },
      })

      // Verify current password
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password,
      )
      if (!isPasswordCorrect) {
        return res
          .status(200)
          .send(new ResponseClass(400, 'Current password is incorrect'))
      }

      // Hash new password
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

      // Update user's password
      user.password = hashedPassword
      await userRepository.save(user)

      return res
        .status(200)
        .send(new ResponseClass(200, 'Password updated successfully'))
    } catch (err) {
      CLog.bad('Password update failed: ', err)
      return res
        .status(400)
        .send(new ResponseClass(400, 'Password update failed.'))
    }
  }
}

export default UserController
