import bcrypt from 'bcryptjs';
import { signAccessToken } from '../../lib/jwt.js';
import { createChurchOwner, findUserByEmail } from './auth.repo.js';

function tokenPayload(userRow) {
  return {
    sub: userRow.id,
    church_id: userRow.church_id,
    role: userRow.role,
    email: userRow.email
  };
}

export async function loginWithPassword({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;

  return {
    accessToken: signAccessToken(tokenPayload(user)),
    tokenType: 'Bearer',
    expiresIn: '15d',
    user: {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      church_id: user.church_id,
      role: user.role
    }
  };
}

export async function registerChurchOwner(input) {
  const passwordHash = await bcrypt.hash(input.password, 12);
  const created = await createChurchOwner({
    churchName: input.churchName,
    timezone: input.timezone,
    email: input.email,
    passwordHash,
    displayName: input.displayName
  });

  const userTokenRow = {
    id: created.user.id,
    email: created.user.email,
    church_id: created.membership.church_id,
    role: created.membership.role
  };

  return {
    accessToken: signAccessToken(tokenPayload(userTokenRow)),
    tokenType: 'Bearer',
    expiresIn: '15d',
    church: created.church,
    user: {
      id: created.user.id,
      email: created.user.email,
      displayName: created.user.display_name,
      church_id: created.membership.church_id,
      role: created.membership.role
    }
  };
}
