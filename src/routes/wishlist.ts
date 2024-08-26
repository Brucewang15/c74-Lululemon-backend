import { Router } from 'express'
import {WishlistController} from "../controllers/WishlistController";

const router = Router()

router.get('/', WishlistController.getWishlist);
router.post('/add', WishlistController.addProductToWishlist);
router.delete('/remove/:productId', WishlistController.removeFromWishlist);

export default router