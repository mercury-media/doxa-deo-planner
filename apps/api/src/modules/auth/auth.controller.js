import { loginSchema, registerChurchSchema } from './auth.schema.js';
import { loginWithPassword, registerChurchOwner } from './auth.service.js';
import { fail, ok } from '../../utils/http.js';

export async function postLogin(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Request body is invalid.', parsed.error.flatten().fieldErrors);
  }

  const result = await loginWithPassword(parsed.data);
  if (!result) {
    return fail(res, 401, 'AUTH_FAILED', 'Email or password is incorrect.');
  }

  return ok(res, result);
}

export async function postRegisterChurch(req, res) {
  const parsed = registerChurchSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Request body is invalid.', parsed.error.flatten().fieldErrors);
  }

  const result = await registerChurchOwner(parsed.data);
  return ok(res, result);
}

export function getMe(req, res) {
  return ok(res, {
    userId: req.auth.sub,
    churchId: req.auth.church_id,
    role: req.auth.role,
    email: req.auth.email
  });
}
