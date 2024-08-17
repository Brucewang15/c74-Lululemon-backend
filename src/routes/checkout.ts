import { Router } from 'express'
import CheckoutController from "../controllers/CheckoutController";


const router = Router();

router.post('/getAllShippingAddress', CheckoutController.getAllShippingAddress)


export default router