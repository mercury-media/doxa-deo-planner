import { z } from 'zod';

export const createScheduleSchema = z.object({
  serviceId: z.string().uuid(),
  userId: z.string().uuid(),
  team: z.string().min(1),
  role: z.string().min(1)
});
