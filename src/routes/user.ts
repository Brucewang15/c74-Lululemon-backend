import { Router } from 'express'
import UserController from '../controllers/UserController'

const router = Router()
router.post('/addOne', UserController.addOne)
router.get('/allUsers', UserController.allUsers)
router.get('/findOneUser/:userId', UserController.findOneUser)
router.put('/updateUser/:userId', UserController.updateUser)
router.delete('/deleteUser/:userId', UserController.deleteUser)

export default router
