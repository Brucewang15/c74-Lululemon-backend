import { Router } from "express";
import { OrderController } from "../controllers/OrderController";

const router = Router();

// 1. get order by order id
router.get("/:orderId", OrderController.getOrder);
// 2. place an order based on userId
router.post("/:userId", OrderController.placeOrder);
// 3. update order status
router.post("/:orderId/updateStatus", OrderController.updateOrderStatus);
// 4. delete an order by orderId
router.delete("/:orderId", OrderController.deleteOrder);
//5. get all orders for a specific user
router.get("/user/:userId", OrderController.getAllOrders);
export default router;
