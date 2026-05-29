import express from 'express';
import { uploadAndAnalyze, getHistory, getResumeDetails, deleteResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Route for uploading a single resume, parsing it, scoring it, and saving it
router.post('/analyze', protect, upload.single('resume'), uploadAndAnalyze);

// Fetch saved histories
router.get('/history', protect, getHistory);

// Retrieve details for a single analysis
router.get('/:id', protect, getResumeDetails);

// Delete an analysis record
router.delete('/:id', protect, deleteResume);

export default router;
