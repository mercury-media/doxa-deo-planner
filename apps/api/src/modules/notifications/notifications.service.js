import webpush from 'web-push';
import { env } from '../../config/env.js';
import { deleteSubscription, listSubscriptions } from './notifications.repo.js';

webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);

export async function sendPushToUser({ churchId, userId, payload }) {
  const subscriptions = await listSubscriptions(churchId, userId);

  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth
            }
          },
          JSON.stringify(payload)
        );
        return { endpoint: subscription.endpoint, sent: true };
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          await deleteSubscription(subscription.endpoint);
        }
        return { endpoint: subscription.endpoint, sent: false };
      }
    })
  );

  return results;
}
