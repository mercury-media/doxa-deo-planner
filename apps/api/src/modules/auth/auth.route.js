import { Router } from 'express';
import { asyncHandler } from '../../utils/http.js';
import { getMe, postLogin, postRegisterChurch } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const authRouter = Router();

authRouter.post('/login', asyncHandler(postLogin));
authRouter.post('/register-church', asyncHandler(postRegisterChurch));
authRouter.get('/me', requireAuth, getMe);

export { authRouter };
