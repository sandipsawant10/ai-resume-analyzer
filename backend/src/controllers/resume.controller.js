import cloudinary from "../config/cloudinary.js";
import { analyzeResumeWithAI } from "../utils/aiClient.js";
import { extractTextFromPDF } from "../utils/pdfReader.js";
import { Resume } from "../models/resume.model.js";

const uploadResumeFile = async (file) => {
  const base64File = file.buffer.toString("base64");
  const dataUri = `data:${file.mimetype};base64,${base64File}`;

  return cloudinary.uploader.upload(dataUri, {
    folder: "resumes",
    resource_type: "raw",
  });
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadedFile = await uploadResumeFile(req.file);

    const fileUrl = uploadedFile.secure_url;

    const text = await extractTextFromPDF(req.file.buffer);
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from PDF" });
    }

    const analysis = await analyzeResumeWithAI(text);

    const resume = await Resume.create({
      user: req.user._id,
      fileUrl,
      publicId: uploadedFile.public_id,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      analysis,
    });

    res.status(200).json({
      message: "Analysis complete",
      fileUrl,
      aiAnalysis: analysis,
      resume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json({ resumes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    await cloudinary.uploader.destroy(resume.publicId, {
      resource_type: "raw",
    });
    await resume.deleteOne();

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const uploadedFile = await uploadResumeFile(req.file);

    const text = await extractTextFromPDF(req.file.buffer);
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from PDF" });
    }

    const analysis = await analyzeResumeWithAI(text);

    await cloudinary.uploader.destroy(resume.publicId, {
      resource_type: "raw",
    });

    resume.fileUrl = uploadedFile.secure_url;
    resume.publicId = uploadedFile.public_id;
    resume.originalName = req.file.originalname;
    resume.mimeType = req.file.mimetype;
    resume.size = req.file.size;
    resume.analysis = analysis;

    await resume.save();

    res.status(200).json({
      message: "Resume updated and analysis complete",
      fileUrl: resume.fileUrl,
      aiAnalysis: analysis,
      resume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export { uploadResume, getMyResumes, deleteResume, updateResume };
