import pdf from 'pdf-parse';

/**
 * Extracts raw text content from a PDF Buffer
 * @param {Buffer} buffer 
 * @returns {Promise<string>}
 */
export const parsePDF = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text || '';
  } catch (error) {
    console.error('❌ PDF Parse Error:', error.message);
    throw new Error(`Failed to parse PDF file: ${error.message}`);
  }
};
