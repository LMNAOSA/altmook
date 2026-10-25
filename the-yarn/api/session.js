import { isAllowed, configured, respond } from '../server/security.js';

export function GET(request) {
  return respond({ authenticated: isAllowed(request), configured: configured() });
}
