/**
 * Murf AI Text-to-Speech Service
 * Streams high-fidelity MP3 speech using Murf's global streaming API.
 */

const MURF_STREAM_ENDPOINT = 'https://global.api.murf.ai/v1/speech/stream';

// Curated list of verified Murf Falcon model voices
export const SUPPORTED_VOICES = [
  { id: 'Namrita', name: 'Namrita (Indian English - Professional)', gender: 'Female', locale: 'en-US' },
  { id: 'en-US-marcus', name: 'Marcus (US English - Confident)', gender: 'Male', locale: 'en-US' },
  { id: 'en-US-alicia', name: 'Alicia (US English - Clear & Warm)', gender: 'Female', locale: 'en-US' },
];

/**
 * Generate speech audio from Murf AI
 * @param {Object} options
 * @param {string} options.text Text to synthesize
 * @param {string} options.voiceId Voice ID (default: Namrita)
 * @param {string} options.locale Locale code (default: en-US)
 * @returns {Promise<{ stream: ReadableStream, contentType: string, buffer: Buffer }>}
 */
export async function generateSpeech({ text, voiceId = 'Namrita', locale = 'en-US' }) {
  const apiKey = process.env.MURF_API_KEY;
  if (!apiKey) {
    throw new Error('MURF_API_KEY is not configured on the server');
  }

  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Speech generation requires non-empty text');
  }

  const cleanText = text.trim().slice(0, 1500); // Safety limit

  console.log(`[Murf Service] Requesting TTS stream for voice="${voiceId}", length=${cleanText.length}`);

  const response = await fetch(MURF_STREAM_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      voice_id: voiceId,
      text: cleanText,
      locale: locale || 'en-US',
      model: 'FALCON',
      format: 'MP3',
      sampleRate: 24000,
      channelType: 'MONO',
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Murf Service] API Error (${response.status}):`, errorBody);

    // If voice_id failed, retry once with default 'Namrita' if different
    if (voiceId !== 'Namrita' && response.status === 400) {
      console.log('[Murf Service] Retrying with default voice Namrita...');
      return generateSpeech({ text: cleanText, voiceId: 'Namrita', locale: 'en-US' });
    }

    throw new Error(`Murf TTS API failed (${response.status}): ${errorBody}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = response.headers.get('content-type') || 'audio/mpeg';

  console.log(`[Murf Service] Audio received successfully, size: ${buffer.length} bytes`);

  return {
    buffer,
    contentType,
  };
}
