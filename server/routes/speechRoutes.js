import express from 'express';
import { generateSpeech, getVoices } from '../controllers/speechController.js';
import { authenticate } from '../middleware/auth.js';
import { speechLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(authenticate);
router.post('/generate', speechLimiter, generateSpeech);
router.get('/voices', getVoices);

export default router;
