import { clearCookie, respond } from '../server/security.js';

export function POST(request) {
  return respond({ ok: true }, 200, { 'Set-Cookie': clearCookie(request) });
}
