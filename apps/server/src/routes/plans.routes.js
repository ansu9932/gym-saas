import { Router } from "express";
import {
  createPlan,
  deletePlan,
  listPlans,
  updatePlan
} from "../controllers/plans.controller.js";
import { USER_ROLES } from "../constants/roles.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", listPlans);
router.post("/", authorizeRoles(USER_ROLES.ADMIN), createPlan);
router.put("/:id", authorizeRoles(USER_ROLES.ADMIN), updatePlan);
router.delete("/:id", authorizeRoles(USER_ROLES.ADMIN), deletePlan);

export default router;
