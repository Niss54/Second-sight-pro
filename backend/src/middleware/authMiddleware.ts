import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
      return;
    }

    // Attach user to request for downstream usage
    (req as any).user = data.user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Internal Server Error during authentication" });
  }
};
