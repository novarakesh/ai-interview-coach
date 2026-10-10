import { Interview } from '../models/Interview.js';
import * as aiService from '../services/aiService.js';

/**
 * Create a new interview session and generate the first question
 * POST /api/interviews
 */
export const createInterview = async (req, res, next) => {
  try {
    const {
      role = 'MERN Stack Developer',
      interviewType = 'Technical',
      difficulty = 'Intermediate',
      language = 'en-US',
      voiceId = 'Namrita',
      totalQuestions = 5,
    } = req.body;

    const validatedTotalQuestions = Math.min(10, Math.max(1, parseInt(totalQuestions, 10) || 5));

    console.log(`[Interview] Starting new session for user ${req.user._id}: role="${role}", type="${interviewType}", difficulty="${difficulty}", questions=${validatedTotalQuestions}`);

    // Generate Question 1 via Gemini AI
    const firstQuestion = await aiService.generateQuestion({
      role,
      interviewType,
      difficulty,
      questionNumber: 1,
      totalQuestions: validatedTotalQuestions,
      previousQuestions: [],
      previousAnswers: [],
      language,
    });

    const interview = await Interview.create({
      userId: req.user._id,
      role,
      interviewType,
      difficulty,
      language,
      voiceId,
      totalQuestions: validatedTotalQuestions,
      status: 'in_progress',
      currentQuestionIndex: 0,
      questions: [firstQuestion],
      answers: [],
      evaluationResults: [],
      startedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Interview session created successfully.',
      interview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all interviews for current authenticated user
 * GET /api/interviews
 */
export const getInterviews = async (req, res, next) => {
  try {
    const { role, interviewType, status } = req.query;
    const query = { userId: req.user._id };

    if (role && role !== 'All') {
      query.role = role;
    }
    if (interviewType && interviewType !== 'All') {
      query.interviewType = interviewType;
    }
    if (status && status !== 'All') {
      query.status = status;
    }

    const interviews = await Interview.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a specific interview by ID
 * GET /api/interviews/:id
 */
export const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    // Verify ownership
    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this interview session.',
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit candidate answer for the current question and get AI evaluation
 * POST /api/interviews/:id/answer
 */
export const submitAnswer = async (req, res, next) => {
  try {
    const { candidateAnswer, durationSeconds = 0 } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this interview session.',
      });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This interview session is already completed.',
      });
    }

    const currentIdx = interview.currentQuestionIndex;
    const currentQ = interview.questions[currentIdx];

    if (!currentQ) {
      return res.status(400).json({
        success: false,
        message: 'No active question found for this index.',
      });
    }

    // Check if an answer was already submitted for this question
    const alreadyAnswered = interview.answers.some(
      (a) => a.questionNumber === currentQ.questionNumber
    );

    if (alreadyAnswered) {
      return res.status(400).json({
        success: false,
        message: `Question ${currentQ.questionNumber} has already been answered and evaluated.`,
      });
    }

    const cleanAnswer = (candidateAnswer || '').trim() || 'No answer provided.';

    // Evaluate answer with Gemini AI
    console.log(`[Interview] Evaluating answer for Q${currentQ.questionNumber} (${currentQ.topic})...`);
    const evaluation = await aiService.evaluateAnswer({
      role: interview.role,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty,
      questionText: currentQ.questionText,
      topic: currentQ.topic,
      candidateAnswer: cleanAnswer,
    });

    // Save answer
    interview.answers.push({
      questionNumber: currentQ.questionNumber,
      questionText: currentQ.questionText,
      candidateAnswer: cleanAnswer,
      answeredAt: new Date(),
      durationSeconds: Number(durationSeconds) || 0,
    });

    // Save evaluation result
    interview.evaluationResults.push({
      questionNumber: currentQ.questionNumber,
      ...evaluation,
      evaluatedAt: new Date(),
    });

    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Answer submitted and evaluated successfully.',
      evaluation,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Move to next question or generate next question if needed
 * POST /api/interviews/:id/next-question
 */
export const getNextQuestion = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this interview session.',
      });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Interview is already completed.',
      });
    }

    const nextIndex = interview.currentQuestionIndex + 1;

    // Check if we've reached the total questions limit
    if (nextIndex >= interview.totalQuestions) {
      return res.status(400).json({
        success: false,
        message: 'All questions have been completed. Please finalize the interview.',
        isFinished: true,
      });
    }

    // Check if question already exists in array (in case user reloaded)
    if (interview.questions[nextIndex]) {
      interview.currentQuestionIndex = nextIndex;
      await interview.save();
      return res.status(200).json({
        success: true,
        question: interview.questions[nextIndex],
        interview,
      });
    }

    // Generate next question via Gemini AI
    console.log(`[Interview] Generating Q${nextIndex + 1} of ${interview.totalQuestions} for session ${interview._id}`);
    const nextQ = await aiService.generateQuestion({
      role: interview.role,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty,
      questionNumber: nextIndex + 1,
      totalQuestions: interview.totalQuestions,
      previousQuestions: interview.questions,
      previousAnswers: interview.answers,
      language: interview.language,
    });

    interview.questions.push(nextQ);
    interview.currentQuestionIndex = nextIndex;
    await interview.save();

    res.status(200).json({
      success: true,
      question: nextQ,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Finish interview session, calculate overall scores and synthesize final report
 * POST /api/interviews/:id/finish
 */
export const finishInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this interview session.',
      });
    }

    const evals = interview.evaluationResults || [];

    // Calculate aggregated scores
    let overallScore = 0;
    let avgRel = 0;
    let avgCorr = 0;
    let avgClar = 0;
    let avgComp = 0;

    if (evals.length > 0) {
      const sumScore = evals.reduce((acc, curr) => acc + (curr.score || 0), 0);
      const sumRel = evals.reduce((acc, curr) => acc + (curr.relevanceScore || 0), 0);
      const sumCorr = evals.reduce((acc, curr) => acc + (curr.correctnessScore || 0), 0);
      const sumClar = evals.reduce((acc, curr) => acc + (curr.clarityScore || 0), 0);
      const sumComp = evals.reduce((acc, curr) => acc + (curr.completenessScore || 0), 0);

      overallScore = Math.round(sumScore / evals.length);
      avgRel = Math.round(sumRel / evals.length);
      avgCorr = Math.round(sumCorr / evals.length);
      avgClar = Math.round(sumClar / evals.length);
      avgComp = Math.round(sumComp / evals.length);
    }

    // Generate Final Synthesis via Gemini AI
    console.log(`[Interview] Generating final synthesis report for session ${interview._id}...`);
    const finalReport = await aiService.generateFinalReport({
      role: interview.role,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty,
      questions: interview.questions,
      answers: interview.answers,
      evaluationResults: interview.evaluationResults,
    });

    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.overallScore = overallScore;
    interview.averageRelevance = avgRel;
    interview.averageCorrectness = avgCorr;
    interview.averageClarity = avgClar;
    interview.averageCompleteness = avgComp;
    interview.summaryStrengths = finalReport.summaryStrengths;
    interview.summaryWeaknesses = finalReport.summaryWeaknesses;
    interview.practiceRecommendations = finalReport.practiceRecommendations;
    interview.overallFeedback = finalReport.overallFeedback;

    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Interview finalized successfully.',
      interview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an interview session
 * DELETE /api/interviews/:id
 */
export const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this interview.',
      });
    }

    await Interview.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Interview session deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
