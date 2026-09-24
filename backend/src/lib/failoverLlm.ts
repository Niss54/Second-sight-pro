/**
 * FailoverLLM — Gemini → Groq automatic failover architecture
 *
 * Pattern:
 * 1. Primary: Google Gemini (gemini-3.6-flash / gemini-3.5-flash-lite)
 * 2. Failover: When Gemini hits rate-limits (HTTP 429), quota limits, or errors,
 *    it instantly auto-switches to Groq (openai/gpt-oss-20b).
 * 3. Fallback: Safe clinical fallback string if both providers are unreachable.
 */
import OpenAI from "openai";
import { env } from "../config/env";

// Groq client — fallback LLM (OpenAI-compatible)
const groqClient =
  env.GROQ_API_KEY
    ? new OpenAI({
        apiKey: env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1"
      })
    : null;

// OpenAI client (optional tertiary provider if configured)
const openaiClient =
  env.OPENAI_API_KEY
    ? new OpenAI({
        apiKey: env.OPENAI_API_KEY,
        baseURL: env.OPENAI_BASE_URL
      })
    : null;

export interface LlmCallOptions {
  /** The system instructions / role for the model */
  systemPrompt: string;
  /** The user message / input */
  userMessage: string;
  /** Max tokens to generate */
  maxTokens?: number;
  /** Returned as-is if all providers fail */
  fallbackText: string;
}

/**
 * Call Google Gemini REST API directly
 */
async function callGemini(
  model: string,
  systemPrompt: string,
  userMessage: string,
  maxTokens: number
): Promise<string | null> {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userMessage }]
      }
    ],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.3
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini HTTP ${response.status}: ${errorText.slice(0, 160)}`);
  }

  const data = (await response.json()) as any;
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  return generatedText || null;
}

/**
 * Call Groq with OpenAI-compatible chat completions
 */
async function callGroq(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number
): Promise<string | null> {
  if (!groqClient || !env.GROQ_API_KEY) return null;

  const modelsToTry = [env.GROQ_MODEL, "openai/gpt-oss-20b", "openai/gpt-oss-120b", "qwen/qwen3.8-27b"];

  for (const model of modelsToTry) {
    try {
      const response = await groqClient.chat.completions.create({
        model,
        max_tokens: maxTokens,
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      });

      const text = response.choices[0]?.message?.content?.trim();
      if (text) {
        console.log(`[FailoverLLM] Groq (${model}) responded successfully.`);
        return text;
      }
    } catch (err: any) {
      console.warn(`[FailoverLLM] Groq attempt with ${model} failed: ${err.message?.slice(0, 80)}`);
    }
  }

  return null;
}

/**
 * Call LLM with automatic failover: Gemini first -> Groq second -> OpenAI third -> static fallback.
 * Never throws — always returns a valid string.
 */
export async function callWithFailover(options: LlmCallOptions): Promise<string> {
  const { systemPrompt, userMessage, maxTokens = 400, fallbackText } = options;

  // ── Step 1: Attempt Gemini (Primary LLM) ───────────────────────────────────
  if (env.GEMINI_API_KEY) {
    try {
      // Primary model: gemini-3.6-flash, fallback: gemini-3.5-flash-lite
      const primaryModel = env.GEMINI_MODEL || "gemini-3.6-flash";
      const result = await callGemini(primaryModel, systemPrompt, userMessage, maxTokens);
      if (result) {
        console.log(`[FailoverLLM] Gemini (${primaryModel}) responded successfully.`);
        return result;
      }
    } catch (geminiError: any) {
      console.warn(
        `[FailoverLLM] Gemini limit reached or error (${geminiError.message?.slice(0, 100)}). Auto-switching to Groq...`
      );

      // Quick retry with gemini-3.5-flash-lite if primary had an issue
      try {
        const liteResult = await callGemini("gemini-3.5-flash-lite", systemPrompt, userMessage, maxTokens);
        if (liteResult) {
          console.log("[FailoverLLM] Gemini (gemini-3.5-flash-lite) responded successfully.");
          return liteResult;
        }
      } catch (liteError: any) {
        console.warn(`[FailoverLLM] Gemini lite also failed: ${liteError.message?.slice(0, 80)}. Switching to Groq...`);
      }
    }
  }

  // ── Step 2: Auto-switch to Groq (Fallback LLM) ─────────────────────────────
  if (groqClient && env.GROQ_API_KEY) {
    try {
      console.log("[FailoverLLM] Executing Groq fallback...");
      const groqResult = await callGroq(systemPrompt, userMessage, maxTokens);
      if (groqResult) {
        return groqResult;
      }
    } catch (groqError: any) {
      console.warn(`[FailoverLLM] Groq failed: ${groqError.message?.slice(0, 80)}`);
    }
  }

  // ── Step 3: Attempt OpenAI (Tertiary LLM if key exists) ───────────────────
  if (openaiClient && env.OPENAI_API_KEY) {
    try {
      const response = await openaiClient.chat.completions.create({
        model: env.OPENAI_MODEL || "gpt-4.1-mini",
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      });

      const text = response.choices[0]?.message?.content?.trim();
      if (text) {
        console.log("[FailoverLLM] OpenAI tertiary responded successfully.");
        return text;
      }
    } catch (openaiErr: any) {
      console.warn(`[FailoverLLM] OpenAI also failed: ${openaiErr.message?.slice(0, 80)}`);
    }
  }

  // ── Step 4: Safe Clinical Fallback ─────────────────────────────────────────
  console.warn("[FailoverLLM] All LLM providers unavailable. Using static medical fallback.");
  return fallbackText;
}
