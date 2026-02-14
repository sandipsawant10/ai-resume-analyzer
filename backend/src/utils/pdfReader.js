import fs from "fs";
import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parsedPdf = new PDFParse({ data: dataBuffer });
    const result = await parsedPdf.getText();
    return result.text;
  } catch (error) {
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};
