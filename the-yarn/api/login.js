import { validPasscode, configured, sessionCookie, respond } from '../server/security.js';

export async function POST(request) {
  if (!configured()) return respond({ error: 'App access is not configured on the server.' }, 503);
  try {
    const body = await request.json();
    const code = typeof body.code === 'string' ? body.code.slice(0, 250) : '';
    if (!validPasscode(code)) return respond({ error: 'That access code is not right.' }, 401);
    return respond({ ok: true }, 200, { 'Set-Cookie': sessionCookie(request) });
  } catch {
    return respond({ error: 'Please enter a valid access code.' }, 400);
  }
}
