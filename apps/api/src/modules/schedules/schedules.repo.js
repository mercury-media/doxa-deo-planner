import { query } from '../../db/client.js';

export async function listSchedules(churchId) {
  const result = await query(
    `select id, church_id, service_id, user_id, team, role, status, created_at
     from schedules
     where church_id = $1
     order by created_at desc`,
    [churchId]
  );

  return result.rows;
}

export async function createSchedule({ churchId, serviceId, userId, team, role }) {
  const result = await query(
    `insert into schedules(church_id, service_id, user_id, team, role)
     values ($1, $2, $3, $4, $5)
     returning id, church_id, service_id, user_id, team, role, status, created_at`,
    [churchId, serviceId, userId, team, role]
  );

  return result.rows[0];
}
