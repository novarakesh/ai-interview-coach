import { Interview } from '../models/Interview.js';

/**
 * Get aggregated dashboard statistics for authenticated user
 * GET /api/dashboard/stats
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const allInterviews = await Interview.find({ userId }).sort({ createdAt: -1 });

    const completed = allInterviews.filter((i) => i.status === 'completed');
    const inProgress = allInterviews.filter((i) => i.status === 'in_progress');

    const totalCompleted = completed.length;
    const totalInterviews = allInterviews.length;

    // Calculate Average Score
    let averageScore = 0;
    if (totalCompleted > 0) {
      const sum = completed.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
      averageScore = Math.round(sum / totalCompleted);
    }

    // Total questions answered
    let totalQuestionsAnswered = 0;
    allInterviews.forEach((inv) => {
      totalQuestionsAnswered += (inv.answers || []).length;
    });

    // Score trends (oldest to newest for graphing)
    const scoreTrends = completed
      .slice(0, 10)
      .reverse()
      .map((inv) => ({
        id: inv._id,
        role: inv.role,
        score: inv.overallScore || 0,
        date: inv.completedAt || inv.createdAt,
      }));

    // Topic / Skill analysis across all evaluated questions
    const topicStats = {};
    completed.forEach((inv) => {
      (inv.evaluationResults || []).forEach((ev) => {
        const matchingQ = (inv.questions || []).find((q) => q.questionNumber === ev.questionNumber);
        const topic = matchingQ?.topic || 'General Core';
        if (!topicStats[topic]) {
          topicStats[topic] = { totalScore: 0, count: 0, topic };
        }
        topicStats[topic].totalScore += ev.score || 0;
        topicStats[topic].count += 1;
      });
    });

    const topicAverages = Object.values(topicStats).map((t) => ({
      topic: t.topic,
      averageScore: Math.round(t.totalScore / t.count),
      count: t.count,
    }));

    // Sort to find strongest and weakest skills
    topicAverages.sort((a, b) => b.averageScore - a.averageScore);
    const strongestSkills = topicAverages.slice(0, 3);
    const weakestSkills = topicAverages.length > 3 ? topicAverages.slice(-3).reverse() : [];

    // Recommended next session
    let recommendedRole = req.user.preferences?.defaultRole || 'MERN Stack Developer';
    let recommendedDifficulty = req.user.preferences?.defaultDifficulty || 'Intermediate';

    if (weakestSkills.length > 0) {
      recommendedRole = `${weakestSkills[0].topic} Focus`;
    }

    // Recent 5 sessions
    const recentSessions = allInterviews.slice(0, 5);

    res.status(200).json({
      success: true,
      stats: {
        totalInterviews,
        totalCompleted,
        inProgressCount: inProgress.length,
        averageScore,
        totalQuestionsAnswered,
        scoreTrends,
        strongestSkills,
        weakestSkills,
        recommendedSession: {
          role: recommendedRole,
          difficulty: recommendedDifficulty,
          type: req.user.preferences?.defaultInterviewType || 'Technical',
        },
        recentSessions,
      },
    });
  } catch (error) {
    next(error);
  }
};
