import { query } from '../../db/client.js';

export async function listServices(churchId) {
  const result = await query(
    `select id, church_id, title, service_date, starts_at, notes, created_at
     from services
     where church_id = $1
     order by service_date desc, starts_at desc`,
    [churchId]
  );

  return result.rows;
}

export async function createService({ churchId, createdBy, title, serviceDate, startsAt, notes }) {
  const result = await query(
    `insert into services(church_id, created_by, title, service_date, starts_at, notes)
     values ($1, $2, $3, $4, $5, $6)
     returning id, church_id, title, service_date, starts_at, notes, created_at`,
    [churchId, createdBy, title, serviceDate, startsAt, notes ?? null]
  );

  return result.rows[0];
}
