import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController";

const router = Router();
router.post("/", PaymentController.createPayment);

router.post("/stripe", PaymentController.createStripePayment);

router.post("/stripe/paid", PaymentController.completeStripePayment);

export default router;
