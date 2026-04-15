import { Router } from "express";
import authRoutes from "./auth.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import membersRoutes from "./members.routes.js";
import notificationsRoutes from "./notifications.routes.js";
import plansRoutes from "./plans.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/plans", plansRoutes);
router.use("/members", membersRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/attendance", attendanceRoutes);

export default router;
