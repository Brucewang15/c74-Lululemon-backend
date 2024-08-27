import { Router } from "express";
import { InvoiceController } from "../controllers/InvoiceController";

const router = Router();

//1. generate invoice and send it back

router.get("/getAnInvoice/:orderId", InvoiceController.generateInvoice);

router.get("/sampleInvoice/:orderId", InvoiceController.sampleInvoice);

export default router;
