import { analyzeResumeWithAI } from "../utils/aiClient.js";
import { extractTextFromPDF } from "../utils/pdfReader.js";

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const filePath = req.file.path;
    const text = await extractTextFromPDF(filePath);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from PDF" });
    }

    const analysis = await analyzeResumeWithAI(text);
    res.status(200).json({
      message: "Analysis complete",
      aiAnalysis: analysis,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { uploadResume };
