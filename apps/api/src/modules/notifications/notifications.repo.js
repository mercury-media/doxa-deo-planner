import crypto from 'node:crypto';
import { query } from '../../db/client.js';

function endpointHash(endpoint) {
  return crypto.createHash('sha256').update(endpoint).digest('hex');
}

export async function upsertSubscription({ churchId, userId, endpoint, p256dh, auth, userAgent }) {
  const hash = endpointHash(endpoint);
  const result = await query(
    `insert into push_subscriptions(church_id, user_id, endpoint, endpoint_hash, p256dh, auth, user_agent)
     values ($1, $2, $3, $4, $5, $6, $7)
     on conflict (church_id, user_id, endpoint_hash)
     do update set p256dh = excluded.p256dh, auth = excluded.auth, user_agent = excluded.user_agent
     returning id, endpoint, created_at`,
    [churchId, userId, endpoint, hash, p256dh, auth, userAgent ?? null]
  );

  return result.rows[0];
}

export async function listSubscriptions(churchId, userId) {
  const result = await query(
    `select id, endpoint, p256dh, auth from push_subscriptions where church_id = $1 and user_id = $2`,
    [churchId, userId]
  );

  return result.rows;
}

export async function deleteSubscription(endpoint) {
  await query(`delete from push_subscriptions where endpoint = $1`, [endpoint]);
}
