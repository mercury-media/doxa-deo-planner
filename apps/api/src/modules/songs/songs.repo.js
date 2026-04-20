import { query } from '../../db/client.js';

export async function listSongs(churchId) {
  const result = await query(
    `select id, church_id, title, artist, key, bpm, ccli, created_at
     from songs
     where church_id = $1
     order by created_at desc`,
    [churchId]
  );
  return result.rows;
}

export async function createSong(churchId, payload) {
  const result = await query(
    `insert into songs(church_id, title, artist, key, bpm, ccli)
     values ($1, $2, $3, $4, $5, $6)
     returning id, church_id, title, artist, key, bpm, ccli, created_at`,
    [churchId, payload.title, payload.artist ?? null, payload.key ?? null, payload.bpm ?? null, payload.ccli ?? null]
  );
  return result.rows[0];
}
