import { ok } from '../../utils/http.js';
import { listChurchesForUser } from './churches.repo.js';

export async function getMyChurches(req, res) {
  const churches = await listChurchesForUser(req.auth.sub);
  return ok(res, churches, { count: churches.length });
}
