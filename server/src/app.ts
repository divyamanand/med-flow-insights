import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { json } from 'express';
import { router as apiRouter } from './routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();
  app.use(json());

  // CORS for development and configurable origins
  const origins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.use(cors({ origin: origins, credentials: true }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', apiRouter);

  // error handler last
  app.use(errorHandler);
  return app;
}
