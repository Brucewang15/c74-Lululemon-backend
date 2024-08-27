import ImageAIController from "../controllers/ImageAIController";

import { Router } from "express";
import fileUpload from "express-fileupload";

const bodyParser = require("body-parser");

const router = Router();

router.get("/", ImageAIController.index);

router.post("/search/uri", ImageAIController.imageSearch_uri);
router.post(
  "/search/img",
  bodyParser.raw({ type: ["image/jpeg", "image/png"], limit: "4mb" }),
  ImageAIController.imageSearch_image,
);

export default router;
