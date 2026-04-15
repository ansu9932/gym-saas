import "./jobs/reminder.js";
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const boot = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

boot();
