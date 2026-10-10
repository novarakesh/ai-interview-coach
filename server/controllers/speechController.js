import * as murfService from '../services/murfService.js';

/**
 * Generate audio speech for interview question via Murf AI
 * POST /api/speech/generate
 */
export const generateSpeech = async (req, res, next) => {
  try {
    const { text, voiceId, locale } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Text parameter is required for speech synthesis.',
      });
    }

    const { buffer, contentType } = await murfService.generateSpeech({
      text,
      voiceId: voiceId || req.user?.preferences?.voiceId || 'Namrita',
      locale: locale || req.user?.preferences?.preferredLanguage || 'en-US',
    });

    res.set({
      'Content-Type': contentType,
      'Content-Length': buffer.length,
      'Cache-Control': 'public, max-age=86400', // Cache repeated question audio
      'Accept-Ranges': 'bytes',
    });

    return res.send(buffer);
  } catch (error) {
    console.error('[Speech Controller] Error generating speech:', error.message);
    return res.status(502).json({
      success: false,
      message: `Text-to-speech generation failed: ${error.message}`,
    });
  }
};

/**
 * List supported voices
 * GET /api/speech/voices
 */
export const getVoices = async (req, res) => {
  res.status(200).json({
    success: true,
    voices: murfService.SUPPORTED_VOICES,
  });
};
