import { createScheduleSchema } from './schedules.schema.js';
import { createSchedule, listSchedules } from './schedules.repo.js';
import { fail, ok } from '../../utils/http.js';

export async function getSchedules(req, res) {
  const schedules = await listSchedules(req.auth.church_id);
  return ok(res, schedules, { count: schedules.length });
}

export async function postSchedule(req, res) {
  const parsed = createScheduleSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid schedule payload.', parsed.error.flatten().fieldErrors);
  }

  const schedule = await createSchedule({
    churchId: req.auth.church_id,
    ...parsed.data
  });

  return ok(res, schedule);
}
