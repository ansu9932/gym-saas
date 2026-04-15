import cors from "cors";
import express from "express";
import path from "path";

import routes from "./routes/index.js";
import paymentRoutes from "./routes/payment.routes.js";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

const app = express();

// ✅ Middlewares
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static uploads
const uploadsPath = path.resolve(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

// ✅ Health route
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "gym-membership-monitoring-api"
  });
});

// ✅ Payment routes
app.use("/api/payment", paymentRoutes);

// ✅ Main routes
app.use("/api", routes);

// ✅ Error handling
app.use(notFound);
app.use(errorHandler);

export default app;