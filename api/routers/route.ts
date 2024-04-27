import { Router } from "express";
import controller from "../controllers/controller";
import tryCatch from "../utils/tryCatch";
import middleware from "../middleware/middleware";

const router = Router();

router.get("/register", tryCatch(controller.register));
router.get("/create-room", middleware.verifyUserData, tryCatch(controller.createRoom));
router.post("/get-room", middleware.verifyUserData, tryCatch(controller.getRoom));
router.get("/get-langs", middleware.verifyUserData, tryCatch(controller.getLangs));
router.post("/set-lang", middleware.verifyUserData, tryCatch(controller.setLang));

export default router;