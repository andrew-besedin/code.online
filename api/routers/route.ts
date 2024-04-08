import { Router } from "express";
import controller from "../controllers/controller";
import middleware from "../middleware/middleware";

const router = Router();

router.get("/test", middleware.verifyUserData, controller.test);

export default router;