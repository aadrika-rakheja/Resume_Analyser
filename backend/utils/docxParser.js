import mammoth from 'mammoth';

/**
 * Extracts raw text content from a DOCX Buffer
 * @param {Buffer} buffer 
 * @returns {Promise<string>}
 */
export const parseDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (error) {
    console.error('❌ DOCX Parse Error:', error.message);
    throw new Error(`Failed to parse DOCX file: ${error.message}`);
  }
};
