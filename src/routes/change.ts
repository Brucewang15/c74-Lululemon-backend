import { Router } from "express";
import changeController from "../controllers/changeController";

const router = Router();
router.post("/changepassword/:token", changeController.change);

export default router;
