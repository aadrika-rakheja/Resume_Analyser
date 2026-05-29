import { parsePDF } from '../utils/pdfParser.js';
import { parseDOCX } from '../utils/docxParser.js';
import { analyzeResume } from '../utils/aiParser.js';
import ResumeModel from '../models/Resume.js';
import UserModel from '../models/User.js';

/**
 * Handle resume upload, parsing, ATS scoring and database saving
 */
export const uploadAndAnalyze = async (req, res) => {
  const { jobDescription } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'Please upload a resume file' });
  }

  try {
    let parsedText = '';
    const filename = file.originalname;

    console.log(`📄 Received file: ${filename} (${file.size} bytes)`);

    // Parse PDF or DOCX from buffer
    if (file.mimetype === 'application/pdf' || filename.endsWith('.pdf')) {
      parsedText = await parsePDF(file.buffer);
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.mimetype === 'application/msword' || 
      filename.endsWith('.docx')
    ) {
      parsedText = await parseDOCX(file.buffer);
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported file type. Only PDF and DOCX are allowed.' });
    }

    if (!parsedText || parsedText.trim().length === 0) {
      return res.status(422).json({ success: false, message: 'Failed to extract text from file. Please ensure the document is not password protected or purely an image scan.' });
    }

    // Retrieve user settings to get any potential user-configured API key
    const user = await UserModel.findById(req.user.id);
    const userSettings = user?.settings || null;

    // Run AI/NLP analysis on parsed text
    console.log('⚡ Running analysis engine...');
    const analysisResults = await analyzeResume(parsedText, jobDescription || '', userSettings);

    // Save history record
    const resumeRecord = await ResumeModel.create({
      userId: req.user.id,
      filename,
      parsedText,
      jobDescription: jobDescription || '',
      skills: analysisResults.skills,
      experience: analysisResults.experience,
      education: analysisResults.education,
      projects: analysisResults.projects,
      contact: analysisResults.contact,
      analysis: analysisResults.analysis
    });

    res.status(201).json({
      success: true,
      message: 'Resume analyzed and saved successfully',
      data: resumeRecord
    });

  } catch (error) {
    console.error('❌ Parse/Analysis Controller Error:', error.message);
    res.status(500).json({ success: false, message: `Failed to analyze resume: ${error.message}` });
  }
};

/**
 * Fetch all resumes analyzed by the logged-in user
 */
export const getHistory = async (req, res) => {
  try {
    const history = await ResumeModel.find({ userId: req.user.id });
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    console.error('❌ History Fetch Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching resume history' });
  }
};

/**
 * Retrieve specific analyzed resume by ID
 */
export const getResumeDetails = async (req, res) => {
  try {
    const resume = await ResumeModel.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume analysis record not found' });
    }

    // Auth check: verify ownership
    if (resume.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not own this record' });
    }

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    console.error('❌ Detail Fetch Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving analysis details' });
  }
};

/**
 * Delete specific analysis record
 */
export const deleteResume = async (req, res) => {
  try {
    const resume = await ResumeModel.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume analysis record not found' });
    }

    // Auth check: verify ownership
    if (resume.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not own this record' });
    }

    await ResumeModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Resume record deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Record Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting analysis record' });
  }
};
