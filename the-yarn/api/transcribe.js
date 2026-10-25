import { respond, requireSession } from '../server/security.js';

const EXT = { 'audio/webm': 'webm', 'audio/mp4': 'm4a', 'audio/ogg': 'ogg', 'audio/mpeg': 'mp3', 'audio/wav': 'wav' };

export async function POST(request) {
  const denied = requireSession(request);
  if (denied) return denied;
  if (!process.env.OPENAI_API_KEY) return respond({ error: 'OPENAI_API_KEY is not configured.' }, 503);

  try {
    const form = await request.formData();
    const audio = form.get('audio');
    if (!(audio instanceof File) || audio.size === 0) return respond({ error: 'No recording was supplied.' }, 400);
    // Keep below the Vercel request-body limit (approx 4.5MB); longer recordings stay available for export.
    if (audio.size > 4_000_000) return respond({ error: 'This recording is too large for automatic transcription. It is saved locally for export; type a short summary to keep the interview going.' }, 413);

    const type = Object.keys(EXT).find(t => audio.type.startsWith(t));
    if (!type) return respond({ error: 'Unsupported recording format. Please use Chrome or Safari.' }, 415);

    const upstream = new FormData();
    upstream.append('file', audio, 'answer.' + EXT[type]);
    upstream.append('model', process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-transcribe');
    upstream.append('language', 'en');
    upstream.append('prompt', 'Australian English. Mat, Cozza, Andamooka, Mooka Boys, opal, matrix opal, crystal opal, mining, machinery. Preserve natural colloquialisms.');
    const apiResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY },
      body: upstream
    });
    const result = await apiResponse.json().catch(() => ({}));
    if (!apiResponse.ok) return respond({ error: result.error?.message || 'Could not transcribe this answer.' }, 502);
    return respond({ text: result.text || '' });
  } catch {
    return respond({ error: 'Transcription failed. The recording is still available for export.' }, 500);
  }
}
