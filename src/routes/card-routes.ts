import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { create, list } from "../controllers/card-controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", create);
router.post("/", list);

export default router;