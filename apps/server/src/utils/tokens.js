import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      gymId: user.gym?._id?.toString() || user.gym.toString()
    },
    env.jwtSecret,
    {
      expiresIn: "7d"
    }
  );

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);
