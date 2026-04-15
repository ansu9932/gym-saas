import { Router } from "express";
import {
  createMember,
  deleteMember,
  exportMembersCsv,
  getMember,
  listMembers,
  renewMember,
  updateMember
} from "../controllers/members.controller.js";
import { USER_ROLES } from "../constants/roles.js";
import { authorizeRoles, protect } from "../middleware/auth.js";
import { uploadMemberPhoto } from "../config/multer.js";

const router = Router();

router.use(protect);
router.get("/", listMembers);
router.get("/export/csv", authorizeRoles(USER_ROLES.ADMIN), exportMembersCsv);
router.get("/:id", getMember);
router.post("/", uploadMemberPhoto.single("profilePhoto"), createMember);
router.put("/:id", uploadMemberPhoto.single("profilePhoto"), updateMember);
router.post("/:id/renew", renewMember);
router.delete("/:id", authorizeRoles(USER_ROLES.ADMIN), deleteMember);

export default router;
