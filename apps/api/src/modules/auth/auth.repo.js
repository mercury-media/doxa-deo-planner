import { withTx, query } from '../../db/client.js';

export async function findUserByEmail(email) {
  const result = await query(
    `
      select u.id, u.email, u.password_hash, u.display_name, m.church_id, m.role
      from users u
      join memberships m on m.user_id = u.id
      where lower(u.email) = lower($1)
      limit 1
    `,
    [email]
  );

  return result.rows[0] ?? null;
}

export async function createChurchOwner({ churchName, timezone, email, passwordHash, displayName }) {
  return withTx(async (client) => {
    const church = await client.query(
      `insert into churches(name, timezone) values ($1, $2) returning id, name, timezone, created_at`,
      [churchName, timezone]
    );

    const user = await client.query(
      `insert into users(email, password_hash, display_name) values ($1, $2, $3) returning id, email, display_name`,
      [email, passwordHash, displayName]
    );

    const membership = await client.query(
      `insert into memberships(church_id, user_id, role) values ($1, $2, 'owner') returning church_id, role`,
      [church.rows[0].id, user.rows[0].id]
    );

    return {
      church: church.rows[0],
      user: user.rows[0],
      membership: membership.rows[0]
    };
  });
}
