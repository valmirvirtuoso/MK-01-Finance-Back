import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { create, list, remove, update } from "../controllers/category-controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", create);
router.get("/", list);
router.patch("/:categoryId", update);
router.delete("/:categoryId", remove);

export default router;