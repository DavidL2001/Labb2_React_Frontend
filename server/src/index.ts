import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3001;

// Make sure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(uploadDir));

// POST /upload – upload a profile image
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// GET /profile-image – check if a profile image exists
app.get("/profile-image", (_req, res) => {
  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  for (const ext of extensions) {
    const filePath = path.join(uploadDir, `profile${ext}`);
    if (fs.existsSync(filePath)) {
      res.json({ imageUrl: `http://localhost:3001/uploads/profile${ext}` });
      return;
    }
  }
  res.json({ imageUrl: null });
});

// DELETE /profile-image – remove profile image
app.delete("/profile-image", (_req, res) => {
  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  for (const ext of extensions) {
    const filePath = path.join(uploadDir, `profile${ext}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true });
      return;
    }
  }
  res.json({ success: false });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
