import { notifySchema, subscribeSchema } from './notifications.schema.js';
import { upsertSubscription } from './notifications.repo.js';
import { sendPushToUser } from './notifications.service.js';
import { fail, ok } from '../../utils/http.js';

export async function postSubscribe(req, res) {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid subscription payload.', parsed.error.flatten().fieldErrors);
  }

  const saved = await upsertSubscription({
    churchId: req.auth.church_id,
    userId: req.auth.sub,
    endpoint: parsed.data.endpoint,
    p256dh: parsed.data.keys.p256dh,
    auth: parsed.data.keys.auth,
    userAgent: req.headers['user-agent']
  });

  return ok(res, saved);
}

export async function postNotifySelf(req, res) {
  const parsed = notifySchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid notification payload.', parsed.error.flatten().fieldErrors);
  }

  const result = await sendPushToUser({
    churchId: req.auth.church_id,
    userId: req.auth.sub,
    payload: parsed.data
  });

  return ok(res, result, { count: result.length });
}
