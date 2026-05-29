import express from 'express';
import { handleResumeChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected chat coach endpoint
router.post('/message', protect, handleResumeChat);

export default router;
