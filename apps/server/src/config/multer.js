import fs from "fs";
import path from "path";
import multer from "multer";

const uploadsDir = path.resolve(process.cwd(), "uploads/members");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname) || ".jpg";
    const safeBase = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 36);
    callback(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e8)}-${safeBase}${extension}`
    );
  }
});

const imageFilter = (_req, file, callback) => {
  if (!file.mimetype.startsWith("image/")) {
    callback(new Error("Only image uploads are allowed"));
    return;
  }

  callback(null, true);
};

export const uploadMemberPhoto = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
});
