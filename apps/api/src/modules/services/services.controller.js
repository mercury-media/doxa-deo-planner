import { createServiceSchema } from './services.schema.js';
import { createService, listServices } from './services.repo.js';
import { fail, ok } from '../../utils/http.js';

export async function getServices(req, res) {
  const services = await listServices(req.auth.church_id);
  return ok(res, services, { count: services.length });
}

export async function postService(req, res) {
  const parsed = createServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid service payload.', parsed.error.flatten().fieldErrors);
  }

  const created = await createService({
    churchId: req.auth.church_id,
    createdBy: req.auth.sub,
    ...parsed.data
  });

  return ok(res, created);
}
