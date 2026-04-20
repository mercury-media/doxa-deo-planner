import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerChurchSchema = z.object({
  churchName: z.string().min(2),
  timezone: z.string().default('UTC'),
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2)
});
