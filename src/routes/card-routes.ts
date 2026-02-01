import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { create, list, remove, update } from "../controllers/card-controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", create);
router.get("/", list);
router.patch("/:cardId", update);
router.delete("/:cardId", remove);

export default router;