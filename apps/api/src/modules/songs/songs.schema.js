import { z } from 'zod';

export const createSongSchema = z.object({
  title: z.string().min(1),
  artist: z.string().optional(),
  key: z.string().optional(),
  bpm: z.number().int().positive().optional(),
  ccli: z.string().optional()
});
