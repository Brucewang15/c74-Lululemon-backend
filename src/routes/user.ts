import { Router } from 'express'
import UserController from '../controllers/UserController'

const router = Router()
const getUserInfoAPI = '/userInfo/:userId'
router.get(getUserInfoAPI, UserController.findUserInfo)

//User Shipping Address APIs ----
// 1. search for a user shipping
router.get(`${getUserInfoAPI}/address`, UserController.getAddress)
//2. add a shipping address to a user
router.post(`${getUserInfoAPI}/address`, UserController.addAddress)
//3. delete a shipping address of a user
router.delete(
  `${getUserInfoAPI}/address/:addressId`,
  UserController.deleteAddress,
)
//4. update a shipping address of a user
router.put(`${getUserInfoAPI}/address/:addressId`, UserController.updateAddress)
// ------
export default router
