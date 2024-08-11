import { Router } from 'express'
import UserController from '../controllers/UserController'

const router = Router()
const getUserInfoAPI = '/userInfo/:userId'
router.get(getUserInfoAPI, UserController.findUserInfo)

//User Shipping Address APIs ----
// 1. search for a user shipping
router.get('/userInfo/:userId/address', UserController.getAddress)
//2. add a shipping address to a user
router.post('/userInfo/:userId/address', UserController.addAddress)
//3. delete a shipping address of a user
router.delete(
  '/userInfo/:userId/address:addressId',
  UserController.deleteAddress,
)
//4. update a shipping address of a user
router.put('/userInfo/:userId/address:addressId', UserController.updateAddress)
// ------
export default router
