import { respond, requireSession } from '../server/security.js';

export async function POST(request) {
  const denied = requireSession(request);
  if (denied) return denied;
  if (!process.env.ELEVENLABS_API_KEY) return respond({ error: 'ELEVENLABS_API_KEY is not configured.' }, 503);
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'UlA7wZyMM2C1YQuvzO1M';
  try {
    const body = await request.json();
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    if (!text || text.length > 700) return respond({ error: 'Question text is missing or too long.' }, 400);
    const target = 'https://api.elevenlabs.io/v1/text-to-speech/' + encodeURIComponent(voiceId) + '?output_format=mp3_44100_128';
    const apiResponse = await fetch(target, {
      method: 'POST',
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2' })
    });
    if (!apiResponse.ok) {
      const details = await apiResponse.json().catch(() => ({}));
      return respond({ error: details.detail?.message || 'ElevenLabs could not generate speech.' }, 502);
    }
    return new Response(await apiResponse.arrayBuffer(), {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' }
    });
  } catch {
    return respond({ error: 'Speech generation failed; the question is still available as text.' }, 500);
  }
}
