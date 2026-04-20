import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/http.js';
import { postNotifySelf, postSubscribe } from './notifications.controller.js';

const notificationsRouter = Router();

notificationsRouter.post('/subscribe', requireAuth, asyncHandler(postSubscribe));
notificationsRouter.post('/notify-self', requireAuth, asyncHandler(postNotifySelf));

export { notificationsRouter };
