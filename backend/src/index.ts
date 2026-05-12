import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import candidateRoutes from "./routes/candidate.routes";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import { connectDB } from "./config/database";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", candidateRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

app.get("/", (req, res) => {
  res.json({
    message: "Candidate Management API",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      candidates: "GET /api/candidates",
      create: "POST /api/candidates",
      getOne: "GET /api/candidates/:id",
      update: "PUT /api/candidates/:id",
      delete: "DELETE /api/candidates/:id",
      validate: "POST /api/candidates/:id/validate"
    }
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`💾 Database: MongoDB Memory Server\n`);
  });
}).catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

export default app;
