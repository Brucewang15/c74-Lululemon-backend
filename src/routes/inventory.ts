
import InventoryController from "../controllers/InventoryController"

import { Router } from "express"
const router = Router()


router.get("/", InventoryController.index);

router.get("/item/:id", InventoryController.item_detail);

export default router
