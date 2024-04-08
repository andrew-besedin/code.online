import { Router } from "express";
import controller from "../controllers/controller";
import tryCatch from "../utils/tryCatch";

const router = Router();

router.get("/register",  tryCatch(controller.register));

export default router;