import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/tokens.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authentication required");
  }

  const token = header.replace("Bearer ", "");
  const decoded = verifyToken(token);
  const user = await User.findById(decoded.sub)
    .select("-password")
    .populate("gym");

  if (!user || !user.isActive) {
    res.status(401);
    throw new Error("Account is not available");
  }

  req.user = user;
  next();
});

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error("You do not have access to this action");
  }

  next();
};
