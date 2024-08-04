import { Router } from 'express'
import UserController from '../controllers/UserController'

const router = Router()

// Route to add a new user
router.post('/addOne', UserController.addOne)

// Route to get all users
router.get('/allUsers', UserController.allUsers)

// Route to find a user by ID
router.get('/findOneUser/:userId', UserController.findOneUser)

// Route to update a user by ID
router.put('/updateUser/:userId', UserController.updateUser)

// Route to delete a user by ID
router.delete('/deleteUser/:userId', UserController.deleteUser)

export default router
