import { query } from '../../db/client.js';

export async function listChurchesForUser(userId) {
  const result = await query(
    `
      select c.id, c.name, c.timezone, m.role
      from memberships m
      join churches c on c.id = m.church_id
      where m.user_id = $1
      order by c.created_at desc
    `,
    [userId]
  );

  return result.rows;
}
