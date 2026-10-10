/**
 * AI Service for Gemini integration
 * Generates dynamic interview questions, evaluates candidate answers,
 * and produces comprehensive final interview summaries.
 */

function getApiKeys() {
  return [
    process.env.AI_API_KEY,
    process.env.AI_API_KEY_BACKUP,
    ...(process.env.AI_API_KEYS ? process.env.AI_API_KEYS.split(',') : []),
  ]
    .map((k) => k?.trim())
    .filter(Boolean);
}

const FALLBACK_MODELS = [
  process.env.AI_MODEL || 'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
];

/**
 * Helper to call Gemini REST API with automatic key rotation and model fallback
 */
async function callGemini(promptText, isJson = true) {
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) {
    throw new Error('AI_API_KEY is not configured on the server. Please set it in your .env file.');
  }

  let lastError = null;

  for (const key of apiKeys) {
    for (const model of FALLBACK_MODELS) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

          const body = {
            contents: [
              {
                parts: [{ text: promptText }],
              },
            ],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 8192,
            },
          };

          if (isJson) {
            body.generationConfig.responseMimeType = 'application/json';
          }

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(30000),
          });

          if (!response.ok) {
            const errorBody = await response.text();
            console.warn(`[AI Service] Model ${model} (key: ...${key.slice(-6)}, attempt ${attempt}) -> HTTP ${response.status}`);

            if ((response.status === 503 || response.status === 429) && attempt === 1) {
              await new Promise((r) => setTimeout(r, 800));
              continue;
            }

            lastError = new Error(`Gemini request failed (${response.status}): ${errorBody}`);
            break; // Try next model or next key
          }

          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!rawText) {
            throw new Error('Gemini API returned an empty response');
          }

          if (isJson) {
            let cleanJson = rawText
              .replace(/^```json\s*/i, '')
              .replace(/^```\s*/i, '')
              .replace(/```$/i, '')
              .trim();

            try {
              return JSON.parse(cleanJson);
            } catch (parseErr) {
              const startIdx = cleanJson.indexOf('{');
              const endIdx = cleanJson.lastIndexOf('}');
              if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
                const jsonSub = cleanJson.substring(startIdx, endIdx + 1);
                try {
                  return JSON.parse(jsonSub);
                } catch (subErr) {
                  try {
                    const sanitized = jsonSub.replace(/[\u0000-\u001F]+/g, ' ');
                    return JSON.parse(sanitized);
                  } catch (sanErr) {
                    console.error('[AI Service] Failed to parse JSON from Gemini:', rawText);
                    throw new Error(`Invalid JSON format in AI response: ${parseErr.message}`);
                  }
                }
              }
              console.error('[AI Service] Failed to parse JSON from Gemini:', rawText);
              throw new Error(`Invalid JSON format in AI response: ${parseErr.message}`);
            }
          }

          return rawText;
        } catch (err) {
          lastError = err;
          console.warn(`[AI Service] Attempt failed on ${model}:`, err.message);
          break;
        }
      }
    }
  }

  throw lastError || new Error('All configured Gemini AI models and keys are currently unavailable.');
}

/**
 * Generate an interview question
 */
export async function generateQuestion({
  role,
  interviewType,
  difficulty,
  questionNumber,
  totalQuestions,
  previousQuestions = [],
  previousAnswers = [],
  language = 'en-US',
}) {
  const prevQuestionsSummary = previousQuestions.length
    ? previousQuestions.map((q, idx) => `Q${idx + 1}: ${q.questionText} (Topic: ${q.topic})`).join('\n')
    : 'None (This is the first question).';

  const prompt = `
You are a Senior Technical Interviewer conducting a mock interview for a ${role} (${difficulty} level, ${interviewType} type).
Question Number: ${questionNumber} of ${totalQuestions}. Language: ${language}.
Previously Asked Questions:
${prevQuestionsSummary}

Instructions:
1. Generate the next realistic technical or behavioral question appropriate for this role and difficulty.
2. Ensure the question is clear, conversational, and suitable for text-to-speech audio.
3. Do not repeat previous topics.

Return ONLY a valid JSON object matching this format:
{
  "questionText": "Question wording to be spoken by interviewer",
  "topic": "Specific Topic",
  "difficulty": "${difficulty}",
  "questionNumber": ${questionNumber}
}
`;

  const result = await callGemini(prompt, true);

  if (!result.questionText) {
    throw new Error('Generated question is missing required questionText field');
  }

  return {
    questionNumber: Number(questionNumber),
    questionText: result.questionText.trim(),
    topic: result.topic || 'Core Competency',
    difficulty: result.difficulty || difficulty,
  };
}

/**
 * Evaluate a candidate's answer
 */
export async function evaluateAnswer({
  role,
  interviewType,
  difficulty,
  questionText,
  topic,
  candidateAnswer,
}) {
  const prompt = `
You are an expert Interview Coach evaluating a candidate's response.
Role: ${role} | Level: ${difficulty} | Topic: ${topic || 'General'}
Interview Question: "${questionText}"
Candidate Answer: "${candidateAnswer || '(Empty answer)'}"

Evaluate the candidate's answer accurately on a 0-100 scale across all 5 score dimensions:
- score: Overall combined score (0-100)
- relevanceScore: How directly it answered the prompt (0-100)
- correctnessScore: Technical accuracy (0-100)
- clarityScore: Communication clarity and structure (0-100)
- completenessScore: Coverage of key points (0-100)
- strengths: Array of 2 concise bullet points
- improvementAreas: Array of 2 concise actionable improvement bullet points
- missingConcepts: Array of 1-2 key missing technical terms or patterns
- suggestedAnswer: Concise exemplar high-scoring answer (2-3 sentences)
- feedback: Encouraging 2-sentence summary feedback

Return strictly valid JSON:
{
  "score": 85,
  "relevanceScore": 85,
  "correctnessScore": 85,
  "clarityScore": 85,
  "completenessScore": 80,
  "strengths": ["Clear explanation of core concepts", "Good structured delivery"],
  "improvementAreas": ["Mention practical trade-offs", "Elaborate with concrete examples"],
  "missingConcepts": ["Key Pattern A"],
  "suggestedAnswer": "An ideal response would mention...",
  "feedback": "Solid response demonstrating good foundational grasp."
}
`;

  const result = await callGemini(prompt, true);

  const clamp = (val, def = 70) => {
    const num = Number(val);
    if (isNaN(num)) return def;
    return Math.max(0, Math.min(100, Math.round(num)));
  };

  const score = clamp(result.score, 75);
  const relevanceScore = clamp(result.relevanceScore, score);
  const correctnessScore = clamp(result.correctnessScore, score);
  const clarityScore = clamp(result.clarityScore, score);
  const completenessScore = clamp(result.completenessScore, score);

  return {
    score,
    relevanceScore,
    correctnessScore,
    clarityScore,
    completenessScore,
    strengths: Array.isArray(result.strengths) && result.strengths.length ? result.strengths : ['Demonstrated foundational understanding.'],
    improvementAreas: Array.isArray(result.improvementAreas) && result.improvementAreas.length ? result.improvementAreas : ['Provide more concrete examples and edge cases.'],
    missingConcepts: Array.isArray(result.missingConcepts) ? result.missingConcepts : [],
    suggestedAnswer: result.suggestedAnswer || 'A structured response discussing key concepts with practical trade-offs.',
    feedback: result.feedback || 'Good attempt. Focus on structuring responses with clear technical examples.',
  };
}

/**
 * Generate final interview report and synthesis
 */
export async function generateFinalReport({
  role,
  interviewType,
  difficulty,
  questions = [],
  answers = [],
  evaluationResults = [],
}) {
  const sessionTranscript = questions
    .map((q, idx) => {
      const ans = answers[idx]?.candidateAnswer || 'N/A';
      const evalRes = evaluationResults[idx] || {};
      return `Q${idx + 1} (${q.topic}): ${q.questionText}
Candidate Answer: ${ans}
Score: ${evalRes.score || 'N/A'}/100
Evaluation Feedback: ${evalRes.feedback || 'N/A'}
Strengths: ${(evalRes.strengths || []).join('; ')}
Improvements: ${(evalRes.improvementAreas || []).join('; ')}
`;
    })
    .join('\n---\n');

  const prompt = `
You are the Lead Hiring Manager and Senior Interview Coach reviewing the complete transcript of an interview for a ${role} (${difficulty} level, ${interviewType} type).

Complete Interview Session Data:
${sessionTranscript}

Instructions:
Synthesize the overall performance into an executive summary report:
1. summaryStrengths: Array of 3-5 macro strengths demonstrated across the entire interview session.
2. summaryWeaknesses: Array of 3-5 macro growth areas or recurring gaps observed across questions.
3. practiceRecommendations: Array of 3-4 concrete actionable next practice topics, projects, or study areas to prepare for real-world interviews.
4. overallFeedback: A motivating 3-4 sentence holistic evaluation summarizing candidate readiness for this role.

You MUST return strictly valid JSON matching this schema:
{
  "summaryStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "summaryWeaknesses": ["Area 1", "Area 2", "Area 3"],
  "practiceRecommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "overallFeedback": "Overall performance summary..."
}
`;

  try {
    const report = await callGemini(prompt, true);
    return {
      summaryStrengths: Array.isArray(report.summaryStrengths) ? report.summaryStrengths : ['Solid fundamental grasp of key concepts.', 'Clear communication on standard workflows.'],
      summaryWeaknesses: Array.isArray(report.summaryWeaknesses) ? report.summaryWeaknesses : ['Need deeper exploration of edge cases and performance optimization.'],
      practiceRecommendations: Array.isArray(report.practiceRecommendations) ? report.practiceRecommendations : ['Review advanced architecture patterns', 'Practice mock interviews focusing on concise articulation.'],
      overallFeedback: report.overallFeedback || 'Great effort in completing this interview. Review the specific question feedback to refine your explanations.',
    };
  } catch (err) {
    console.error('[AI Service] Error generating final report summary:', err.message);
    return {
      summaryStrengths: ['Completed all interview questions with structured responses.'],
      summaryWeaknesses: ['Can improve depth on specialized technical topics.'],
      practiceRecommendations: ['Review core domain patterns and conduct frequent timed mock interviews.'],
      overallFeedback: 'Good overall performance. Continue practicing to increase speed and technical precision.',
    };
  }
}
