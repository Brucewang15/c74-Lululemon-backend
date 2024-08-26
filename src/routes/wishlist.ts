import { Router } from "express";
import { WishlistController } from "../controllers/WishlistController";

const router = Router();

router.get("/:userId", WishlistController.getWishlist);
router.post("/add/:userId", WishlistController.addProductToWishlist);
router.delete("/remove/:userId/:productId", WishlistController.removeFromWishlist);

export default router;
