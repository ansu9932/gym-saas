import { Router } from "express";
import { getOverview } from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/overview", getOverview);

export default router;
