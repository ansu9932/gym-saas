import { Router } from "express";
import {
  listNotifications,
  markAllAsRead,
  markAsRead
} from "../controllers/notifications.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", listNotifications);
router.patch("/mark-all-read", markAllAsRead);
router.patch("/:id/read", markAsRead);

export default router;
