import { z } from 'zod';

export const createServiceSchema = z.object({
  title: z.string().min(2),
  serviceDate: z.string().date(),
  startsAt: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  notes: z.string().optional()
});
