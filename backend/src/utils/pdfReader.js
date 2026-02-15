import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async (buffer) => {
  try {

    const options = {
      data: buffer,
      verbosity: 0, // Suppress logging
    };

    const parsedPdf = new PDFParse(options);
    const result = await parsedPdf.getText();

    return result.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};
