import { Router } from 'express'
import AuthController from '../controllers/AuthController'

const router = Router()

router.post('/login', AuthController.login)
router.post('/signup', AuthController.signUp)
router.post('/forgot-password', AuthController.checking)

export default router
