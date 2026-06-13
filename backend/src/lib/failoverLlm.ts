/**
 * FailoverLLM — OpenAI → Groq automatic fallback
 *
 * Pattern: Try OpenAI first. If it throws any error (rate limit, quota,
 * API unavailable), immediately retry with Groq. If both fail, return
 * the provided static fallback string.
 *
 * This makes the demo resilient during live presentations.
 */
import OpenAI from "openai";
import { env } from "../config/env";

// OpenAI client — primary LLM
const openaiClient =
  env.OPENAI_API_KEY
    ? new OpenAI({
        apiKey: env.OPENAI_API_KEY,
        baseURL: env.OPENAI_BASE_URL
      })
    : null;

// Groq client — fallback LLM (OpenAI-compatible, free tier)
const groqClient =
  env.GROQ_API_KEY
    ? new OpenAI({
        apiKey: env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1"
      })
    : null;

export interface LlmCallOptions {
  /** The system instructions / role for the model */
  systemPrompt: string;
  /** The user message / input */
  userMessage: string;
  /** Max tokens to generate */
  maxTokens?: number;
  /** Returned as-is if both OpenAI and Groq fail */
  fallbackText: string;
}

/**
 * Call LLM with automatic failover: OpenAI first, Groq second, static fallback third.
 * Never throws — always returns a string.
 */
export async function callWithFailover(options: LlmCallOptions): Promise<string> {
  const { systemPrompt, userMessage, maxTokens = 300, fallbackText } = options;

  // ── Attempt 1: OpenAI Responses API ─────────────────────────────────────
  if (openaiClient && env.OPENAI_API_KEY) {
    try {
      const response = await openaiClient.responses.create({
        model: env.OPENAI_MODEL,
        instructions: systemPrompt,
        input: userMessage
      });

      const text = response.output_text?.trim();
      if (text) {
        return text;
      }
    } catch (openaiError) {
      // Log but do not rethrow — proceed to Groq fallback
      const errorMessage =
        openaiError instanceof Error ? openaiError.message : String(openaiError);
      console.warn(
        `[FailoverLLM] OpenAI failed (${errorMessage.slice(0, 80)}). Trying Groq...`
      );
    }
  }

  // ── Attempt 2: Groq Chat Completions API (free, fast) ───────────────────
  if (groqClient && env.GROQ_API_KEY) {
    try {
      const response = await groqClient.chat.completions.create({
        model: env.GROQ_MODEL,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      });

      const text = response.choices[0]?.message?.content?.trim();
      if (text) {
        console.log("[FailoverLLM] Groq responded successfully.");
        return text;
      }
    } catch (groqError) {
      const errorMessage =
        groqError instanceof Error ? groqError.message : String(groqError);
      console.warn(
        `[FailoverLLM] Groq also failed (${errorMessage.slice(0, 80)}). Using static fallback.`
      );
    }
  }

  // ── Attempt 3: Static fallback ───────────────────────────────────────────
  console.warn("[FailoverLLM] Both LLMs unavailable. Using static fallback text.");
  return fallbackText;
}
