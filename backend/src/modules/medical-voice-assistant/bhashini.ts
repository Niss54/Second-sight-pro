import { env } from "../../config/env";

const BHASHINI_LANG_MAP: Record<string, string> = {
  "hi-IN": "hi",   // Hindi
  "bn-IN": "bn",   // Bengali
  "ta-IN": "ta",   // Tamil
  "te-IN": "te",   // Telugu
  "mr-IN": "mr",   // Marathi
  "gu-IN": "gu",   // Gujarati
  "kn-IN": "kn",   // Kannada
  "ml-IN": "ml",   // Malayalam
  "pa-IN": "pa",   // Punjabi
  "en-IN": "en",   // English (Indian)
};

export async function transcribeWithBhashini(
  audioBase64: string,
  languageCode: string = "hi-IN"
): Promise<string | null> {
  try {
    const userID = env.BHASHINI_USER_ID;
    const apiKey = env.BHASHINI_API_KEY;

    if (!userID || !apiKey) {
      console.warn("Bhashini STT warning: BHASHINI_USER_ID or BHASHINI_API_KEY is missing in env.");
      return null;
    }

    const sourceLang = BHASHINI_LANG_MAP[languageCode] || "hi";

    // Step 1: Get pipeline config
    const pipelineConfigRes = await fetch("https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline", {
      method: "POST",
      headers: {
        "userID": userID,
        "ulcaApiKey": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: "asr",
            config: {
              language: {
                sourceLanguage: sourceLang
              }
            }
          }
        ],
        pipelineRequestConfig: {
          pipelineId: "64392f96daac500b55c543cd"
        }
      })
    });

    if (!pipelineConfigRes.ok) {
      console.error("Bhashini STT error: Step 1 failed", await pipelineConfigRes.text());
      return null;
    }

    const pipelineData = await pipelineConfigRes.json();
    
    const config = pipelineData?.pipelineResponseConfig?.[0]?.config?.[0];
    const callbackUrl = pipelineData?.pipelineResponseConfig?.[0]?.callbackUrl;

    if (!config || !callbackUrl) {
      console.warn("Bhashini STT warning: Invalid pipeline response format.");
      return null;
    }

    const { inferenceApiKey, serviceId } = config;

    if (!inferenceApiKey || !serviceId) {
      console.warn("Bhashini STT warning: Missing inferenceApiKey or serviceId in pipeline config.");
      return null;
    }

    // Step 2: Actual transcription
    const inferenceRes = await fetch(callbackUrl, {
      method: "POST",
      headers: {
        "Authorization": inferenceApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: "asr",
            config: {
              language: {
                sourceLanguage: sourceLang
              },
              serviceId: serviceId,
              audioFormat: "wav",
              samplingRate: 16000
            }
          }
        ],
        inputData: {
          audio: [
            {
              audioContent: audioBase64
            }
          ]
        }
      })
    });

    if (!inferenceRes.ok) {
      console.error("Bhashini STT error: Step 2 failed", await inferenceRes.text());
      return null;
    }

    const inferenceData = await inferenceRes.json();
    const transcript = inferenceData?.pipelineResponse?.[0]?.output?.[0]?.source;

    if (!transcript) {
      console.warn("Bhashini STT warning: Transcript not found in final response.");
      return null;
    }

    return transcript;

  } catch (error) {
    console.error("Bhashini STT error:", error);
    return null;
  }
}
