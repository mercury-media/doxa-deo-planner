import { createSongSchema } from './songs.schema.js';
import { createSong, listSongs } from './songs.repo.js';
import { fail, ok } from '../../utils/http.js';

export async function getSongs(req, res) {
  const songs = await listSongs(req.auth.church_id);
  return ok(res, songs, { count: songs.length });
}

export async function postSong(req, res) {
  const parsed = createSongSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid song payload.', parsed.error.flatten().fieldErrors);
  }

  const song = await createSong(req.auth.church_id, parsed.data);
  return ok(res, song);
}
