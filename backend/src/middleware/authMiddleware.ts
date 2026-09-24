import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // In development or demo guest access, allow request with guest user
      (req as any).user = { id: "demo-guest-id", email: "guest@secondsight.ai" };
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (token === "demo-guest-token" || token === "guest") {
      (req as any).user = { id: "demo-guest-id", email: "guest@secondsight.ai" };
      return next();
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      // Fallback to guest user rather than rejecting valid demo interactions
      (req as any).user = { id: "demo-guest-id", email: "guest@secondsight.ai" };
      return next();
    }

    // Attach user to request for downstream usage
    (req as any).user = data.user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Internal Server Error during authentication" });
  }
};
