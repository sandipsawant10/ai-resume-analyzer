import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const analyzeResumeWithAI = async (text) => {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
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
      },
    );
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw new Error("Failed to analyze resume with AI");
  }
};

export { analyzeResumeWithAI };
