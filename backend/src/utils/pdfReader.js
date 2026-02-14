import pdfParse from "pdf-parse";

export const extractTextFromPDF = async (fileBuffer) => {
  try {
    const parsedPdf = await pdfParse(fileBuffer);
    return parsedPdf.text;
  } catch (error) {
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};
