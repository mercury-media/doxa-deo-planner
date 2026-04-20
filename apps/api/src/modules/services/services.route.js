import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/http.js';
import { getServices, postService } from './services.controller.js';

const servicesRouter = Router();

servicesRouter.get('/', requireAuth, asyncHandler(getServices));
servicesRouter.post('/', requireAuth, requireRole('owner', 'admin', 'leader'), asyncHandler(postService));

export { servicesRouter };
