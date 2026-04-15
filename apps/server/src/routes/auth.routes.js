import { Router } from "express";
import {
  createStaff,
  getMe,
  listStaff,
  login,
  register
} from "../controllers/auth.controller.js";
import { USER_ROLES } from "../constants/roles.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/staff", protect, authorizeRoles(USER_ROLES.ADMIN), listStaff);
router.post("/staff", protect, authorizeRoles(USER_ROLES.ADMIN), createStaff);

export default router;
