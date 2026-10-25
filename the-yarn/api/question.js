import { respond, requireSession } from '../server/security.js';
import { INTERVIEWER_INSTRUCTIONS } from '../server/interviewer.js';

const modes = new Set(['mat', 'cozza', 'both']);

export async function POST(request) {
  const denied = requireSession(request);
  if (denied) return denied;
  if (!process.env.OPENAI_API_KEY) return respond({ error: 'OPENAI_API_KEY is not configured.' }, 503);

  try {
    const body = await request.json();
    const mode = modes.has(body.mode) ? body.mode : 'both';
    const supplied = Array.isArray(body.history) ? body.history.slice(-24) : [];
    const history = supplied.filter(t =>
      t && ['assistant', 'user'].includes(t.role) && typeof t.content === 'string'
    ).map(t => ({ role: t.role, content: t.content.slice(0, 5500) }));
    const total = history.reduce((n, x) => n + x.content.length, 0);
    if (total > 65000) return respond({ error: 'Interview history is too long; please export and begin a new session.' }, 413);

    const names = mode === 'mat' ? 'Mat only' : mode === 'cozza' ? 'Cozza only' : 'Mat and Cozza together';
    const input = [
      { role: 'user', content: 'Interviewees: ' + names + '. Conduct the interview naturally. The following exchanges are the interview so far.' },
      ...history,
    ];
    if (!history.length) input.push({ role: 'user', content: 'Begin the interview with one warm, open-ended story question.' });
    else if (body.skip === true) input.push({ role: 'user', content: 'I would rather skip that one. Please ask a different question.' });

    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_INTERVIEW_MODEL || 'gpt-6.1-sol',
        instructions: INTERVIEWER_INSTRUCTIONS,
        input,
        reasoning: { effort: 'medium' },
        max_output_tokens: 1200,
        store: false
      })
    });
    const result = await apiResponse.json().catch(() => ({}));
    if (!apiResponse.ok) {
      return respond({ error: result.error?.message || 'The interviewer could not generate a question.' }, 502);
    }
    const text = (result.output_text || (result.output || []).flatMap(o => o.content || [])
      .filter(c => c.type === 'output_text').map(c => c.text).join('')).trim();
    if (!text) return respond({ error: 'No interviewer question was returned. Please retry.' }, 502);
    return respond({ question: text.slice(0, 650) });
  } catch (error) {
    return respond({ error: 'The interview request failed. Please retry.' }, 500);
  }
}
