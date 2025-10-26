import dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from './config/data-source';
import { createApp } from './app';
import { StaffAllotmentService } from './services/StaffAllotmentService';

const PORT = Number(process.env.PORT || 4000);

async function bootstrap() {
  console.log(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD)
  await AppDataSource.initialize();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });

  // Background scheduler: periodically process pending staff allotment requests
  const allotService = new StaffAllotmentService();
  setInterval(() => {
    allotService.processPendingRequests().catch((e) => console.error('Allotment scheduler error', e));
  }, 60 * 1000);
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
