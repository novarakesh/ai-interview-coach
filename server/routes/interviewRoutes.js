import express from 'express';
import {
  createInterview,
  getInterviews,
  getInterviewById,
  deleteInterview,
  submitAnswer,
  getNextQuestion,
  finishInterview,
} from '../controllers/interviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All interview routes are protected
router.use(authenticate);

router.post('/', createInterview);
router.get('/', getInterviews);
router.get('/:id', getInterviewById);
router.delete('/:id', deleteInterview);
router.post('/:id/answer', submitAnswer);
router.post('/:id/next-question', getNextQuestion);
router.post('/:id/finish', finishInterview);

export default router;
