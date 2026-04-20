import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { authRouter } from './modules/auth/auth.route.js';
import { churchesRouter } from './modules/churches/churches.route.js';
import { servicesRouter } from './modules/services/services.route.js';
import { songsRouter } from './modules/songs/songs.route.js';
import { schedulesRouter } from './modules/schedules/schedules.route.js';
import { notificationsRouter } from './modules/notifications/notifications.route.js';
import { fail } from './utils/http.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN
  })
);
app.use(express.json());

app.get('/healthz', (_, res) => {
  res.json({ ok: true });
});

app.use(`${env.API_PREFIX}/auth`, authRouter);
app.use(`${env.API_PREFIX}/churches`, churchesRouter);
app.use(`${env.API_PREFIX}/services`, servicesRouter);
app.use(`${env.API_PREFIX}/songs`, songsRouter);
app.use(`${env.API_PREFIX}/schedules`, schedulesRouter);
app.use(`${env.API_PREFIX}/notifications`, notificationsRouter);

app.use((_, res) => fail(res, 404, 'NOT_FOUND', 'Route not found.'));

app.use((error, _, res, __) => {
  // Keep this explicit and easy for mid-level debugging.
  console.error(error);
  return fail(res, 500, 'INTERNAL_ERROR', 'Unexpected server error.');
});

export { app };
