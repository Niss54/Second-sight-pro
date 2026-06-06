import { env } from "../../config/env";

export async function generateSarvamSpeech(text: string, languageCode: "hi-IN" | "en-IN" = "hi-IN"): Promise<string | null> {
  if (!env.SARVAM_API_KEY) {
    return null;
  }

  try {
    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": env.SARVAM_API_KEY
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: languageCode,
        speaker: "meera",
        pitch: 0,
        pace: 1.05,
        loudness: 1.2,
        speech_sample_rate: 16000,
        enable_preprocessing: true,
        model: "bulbul:v1"
      })
    });

    if (!response.ok) {
      console.error("Sarvam TTS error:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.audios?.[0] || null;
  } catch (error) {
    console.error("Sarvam TTS exception:", error);
    return null;
  }
}
