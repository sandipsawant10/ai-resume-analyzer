import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const url = "https://openrouter.ai/api/v1/chat/completions";

const analyzeResumeWithAI = async (text) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content:
              "Analyze this resume and give score, skills, improvements: " +
              text,
          },
        ],
      }),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        data?.error?.message || `AI API error: ${response.status}`;
      throw new Error(message);
    }

    if (!data?.choices?.[0]?.message?.content) {
      throw new Error("AI response missing content");
    }

    return data?.choices[0].message.content;
  } catch (error) {
    throw new Error("Failed to analyze resume with AI");
  }
};

export { analyzeResumeWithAI };
