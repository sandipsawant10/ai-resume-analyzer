import { analyzeResumeWithAI } from "../utils/aiClient";
import { extractTextFromPDF } from "../utils/pdfReader";

const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const filePath = req.file.path;
  const text = await extractTextFromPDF(filePath);
  const analysis = await analyzeResumeWithAI(text);
  res.status(200).json({
    message: "Analysis complete",
    aiAnalysis: analysis,
  });
};

export { uploadResume };
