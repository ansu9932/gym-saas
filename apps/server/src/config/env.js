import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const candidatePaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(process.cwd(), "../../.env")
];

candidatePaths.forEach((envPath) => {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
});

export const env = {
  port: Number(process.env.PORT || 5000),
  mongodbUri:
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/gym-membership-monitoring",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "FlexBoard <no-reply@example.com>"
  },
  whatsapp: {
    enabled: process.env.ENABLE_WHATSAPP === "true",
    apiUrl: process.env.WHATSAPP_API_URL || "",
    apiToken: process.env.WHATSAPP_API_TOKEN || ""
  },
  timezone:
    process.env.TIMEZONE ||
    process.env.TZ ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "Asia/Kolkata"
};
