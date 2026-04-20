import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/http.js';
import { getMyChurches } from './churches.controller.js';

const churchesRouter = Router();

churchesRouter.get('/mine', requireAuth, asyncHandler(getMyChurches));

export { churchesRouter };
