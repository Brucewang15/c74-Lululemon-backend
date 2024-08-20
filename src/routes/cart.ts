import { Router } from "express";
import { CartController } from "../controllers/CartController";

const router = Router();

// 1. get all the items from the cart ( render shoppingCart page)
router.get("/:cartId", CartController.getItem);
// 2. Add a single item to the cart (add To Bag) / either add a new item, or existing item quantity + 1
router.post("/:cartId/addItem", CartController.addSingleItem);
// 3. delete an item from the cart (remove item in shopping cart page)
router.delete("/:cartId/deleteItem/:itemId", CartController.deleteItem);
// 4. ONLY update an item's quantity from the cart (shoppingCart page -- frontend)
router.put("/:cartId/updateQuantity/:itemId", CartController.updateQuantity);
// 5. Updating cart Item's attributes (shopping cart page)
router.put("/:cartId/updateItem/:itemId", CartController.updateItemAttributes);
// 6. Adding the whole cart to the backend when user is logged in ( shopping cart page)
router.post("/:cartId/syncCart", CartController.syncCart);

export default router;
