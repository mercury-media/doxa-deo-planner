import { z } from 'zod';

export const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1)
  })
});

export const notifySchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  url: z.string().url().optional()
});
