import cloudinary from "../config/cloudinary.js";
import { analyzeResumeWithAI } from "../utils/aiClient.js";
import { extractTextFromPDF } from "../utils/pdfReader.js";

const uploadResume = async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).json({ error: "No file uploaded" });
    }

    // convert buffer → base64
    const base64File = request.file.buffer.toString("base64");

    const dataUri = `data:${request.file.mimetype};base64,${base64File}`;

    // upload to cloudinary
    const uploadedFile = await cloudinary.uploader.upload(dataUri, {
      folder: "resumes",
      resource_type: "auto",
    });

    const fileUrl = uploadedFile.secure_url;

    // extract text from buffer instead of path
    const text = await extractTextFromPDF(request.file.buffer);

    if (!text || text.trim().length === 0) {
      return response
        .status(400)
        .json({ error: "Could not extract text from PDF" });
    }

    const analysis = await analyzeResumeWithAI(text);

    response.status(200).json({
      message: "Analysis complete",
      fileUrl: fileUrl,
      aiAnalysis: analysis,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
};

export { uploadResume };
