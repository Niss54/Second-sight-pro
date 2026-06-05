import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { evidenceRouter } from "./routes/evidenceRoutes";
import { healthRouter } from "./routes/healthRoutes";

const app = express();

const allowedOrigins = env.FRONTEND_ORIGIN.split(",")
  .map((item) => item.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: false
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (_req, res) => {
  res.json({
    service: "Guideline Retrieval API",
    docs: "/api/health"
  });
});

app.use("/api/health", healthRouter);
app.use("/api/evidence", evidenceRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Guideline Retrieval API running on http://localhost:${env.PORT}`);
});
