import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/http.js';
import { getSchedules, postSchedule } from './schedules.controller.js';

const schedulesRouter = Router();

schedulesRouter.get('/', requireAuth, asyncHandler(getSchedules));
schedulesRouter.post('/', requireAuth, requireRole('owner', 'admin', 'leader'), asyncHandler(postSchedule));

export { schedulesRouter };
