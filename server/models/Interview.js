import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    default: 'General',
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  askedAt: {
    type: Date,
    default: Date.now,
  },
});

const answerSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  candidateAnswer: {
    type: String,
    required: true,
  },
  answeredAt: {
    type: Date,
    default: Date.now,
  },
  durationSeconds: {
    type: Number,
    default: 0,
  },
});

const evaluationSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  relevanceScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 70,
  },
  correctnessScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 70,
  },
  clarityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 70,
  },
  completenessScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 70,
  },
  strengths: {
    type: [String],
    default: [],
  },
  improvementAreas: {
    type: [String],
    default: [],
  },
  missingConcepts: {
    type: [String],
    default: [],
  },
  suggestedAnswer: {
    type: String,
    default: '',
  },
  feedback: {
    type: String,
    default: '',
  },
  evaluatedAt: {
    type: Date,
    default: Date.now,
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: [true, 'Interview role is required'],
      trim: true,
    },
    interviewType: {
      type: String,
      enum: ['Technical', 'Behavioral', 'HR', 'Mixed'],
      default: 'Technical',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    language: {
      type: String,
      default: 'en-US',
    },
    voiceId: {
      type: String,
      default: 'Namrita',
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      default: 5,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
      index: true,
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    questions: [questionSchema],
    answers: [answerSchema],
    evaluationResults: [evaluationSchema],
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    averageRelevance: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    averageCorrectness: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    averageClarity: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    averageCompleteness: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    summaryStrengths: {
      type: [String],
      default: [],
    },
    summaryWeaknesses: {
      type: [String],
      default: [],
    },
    practiceRecommendations: {
      type: [String],
      default: [],
    },
    overallFeedback: {
      type: String,
      default: '',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast queries by user and date
interviewSchema.index({ userId: 1, createdAt: -1 });
interviewSchema.index({ userId: 1, status: 1 });

export const Interview = mongoose.model('Interview', interviewSchema);
