import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/http.js';
import { getSongs, postSong } from './songs.controller.js';

const songsRouter = Router();

songsRouter.get('/', requireAuth, asyncHandler(getSongs));
songsRouter.post('/', requireAuth, requireRole('owner', 'admin', 'leader'), asyncHandler(postSong));

export { songsRouter };
