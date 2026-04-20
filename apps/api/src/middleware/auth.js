import { verifyAccessToken } from '../lib/jwt.js';
import { fail } from '../utils/http.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return fail(res, 401, 'AUTH_REQUIRED', 'Missing or invalid bearer token.');
  }

  try {
    req.auth = verifyAccessToken(token);
    return next();
  } catch {
    return fail(res, 401, 'AUTH_INVALID', 'Token is invalid or expired.');
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.auth.role)) {
      return fail(res, 403, 'FORBIDDEN', 'You do not have permission for this action.');
    }
    return next();
  };
}
