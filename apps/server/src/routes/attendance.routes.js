import { Router } from "express";
import {
  checkInMember,
  getMemberQrCode,
  listAttendance
} from "../controllers/attendance.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", listAttendance);
router.get("/:memberId/qrcode", getMemberQrCode);
router.post("/check-in", checkInMember);

export default router;
