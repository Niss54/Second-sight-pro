import dns from "node:dns";
// Configure fast and resilient DNS resolvers for cloud APIs (Supabase, Google Gemini, Groq)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore in sandboxed environments where setServers may not be permitted
}

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { standardRateLimiter, aiRateLimiter } from "./middleware/rateLimiter";
import { requireAuth } from "./middleware/authMiddleware";
import { healthRouter } from "./routes/healthRoutes";
import { reconciliationRouter } from "./routes/reconciliationRoutes";
import { casesRouter } from "./routes/caseRoutes";
import { reportsRouter } from "./routes/reportRoutes";
import { ocrRouter } from "./routes/ocrRoutes";
import { voiceRouter } from "./routes/voiceRoutes";
import { analysisRouter } from "./routes/analysisRoutes";

const app = express();

const allowedOrigins = env.FRONTEND_ORIGIN.split(",")
  .map((item) => item.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? "*" : allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: false
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false // Allows API to serve JSON without CSP restrictions
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// Standard rate limiting for all incoming API routes
app.use("/api", standardRateLimiter);

app.get("/", (_req, res) => {
  res.json({
    service: "SecondSight Pro Guideline Retrieval & Clinical AI API",
    docs: "/api/health",
    version: "1.0.0"
  });
});

app.use("/api/health", healthRouter);

// AI & Compute-Intensive Routes: Protected with requireAuth + AI-specific rate limiting
app.use("/api/reconciliation", requireAuth, aiRateLimiter, reconciliationRouter);
app.use("/api/cases", requireAuth, casesRouter);
app.use("/api/reports", requireAuth, reportsRouter);
app.use("/api/ocr", requireAuth, aiRateLimiter, ocrRouter);
app.use("/api/voice", requireAuth, aiRateLimiter, voiceRouter);
app.use("/api/analyze", requireAuth, aiRateLimiter, analysisRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Guideline Retrieval API running on http://localhost:${env.PORT}`);
});
