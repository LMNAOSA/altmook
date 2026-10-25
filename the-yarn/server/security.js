import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

const NAME = 'the_yarn_session';
const TWELVE_HOURS = 12 * 60 * 60 * 1000;

export function respond(data, status = 200, extra = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...extra } });
}

function stableEqual(a, b) {
  const x = createHash('sha256').update(String(a)).digest();
  const y = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(x, y);
}

function signature(payload) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 24) return '';
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function validPasscode(candidate) {
  const expected = process.env.APP_ACCESS_CODE;
  if (!expected || expected.length < 12 || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 24) return false;
  return stableEqual(candidate || '', expected);
}

export function configured() {
  return Boolean(process.env.APP_ACCESS_CODE?.length >= 12 && process.env.SESSION_SECRET?.length >= 24);
}

export function sessionCookie(request) {
  const body = Buffer.from(JSON.stringify({ exp: Date.now() + TWELVE_HOURS })).toString('base64url');
  const token = body + '.' + signature(body);
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return NAME + '=' + token + '; HttpOnly; Path=/; SameSite=Strict; Max-Age=43200' + secure;
}

export function clearCookie(request) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return NAME + '=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0' + secure;
}

export function isAllowed(request) {
  if (!configured()) return false;
  const cookie = request.headers.get('cookie') || '';
  const token = cookie.split(';').map(x => x.trim()).find(x => x.startsWith(NAME + '='))?.slice(NAME.length + 1);
  if (!token) return false;
  const [payload, mac] = token.split('.');
  if (!payload || !mac || !stableEqual(mac, signature(payload))) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number.isFinite(parsed.exp) && parsed.exp > Date.now();
  } catch { return false; }
}

export function requireSession(request) {
  if (!configured()) return respond({ error: 'Server setup required. Configure APP_ACCESS_CODE and SESSION_SECRET.' }, 503);
  if (!isAllowed(request)) return respond({ error: 'Session expired. Sign in again.' }, 401);
  return null;
}
