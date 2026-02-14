import fs from "fs";
import pdf from "pdf-parse";

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error("Failed to extract text")
  }
};
