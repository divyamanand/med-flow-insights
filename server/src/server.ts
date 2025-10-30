import dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from './config/data-source';
import { createApp } from './app';
import { StaffAllotmentService } from './services/StaffAllotmentService';

const PORT = Number(process.env.PORT || 4000);

async function bootstrap() {
  try {
    console.log('Starting server...');
    console.log('Database config:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME
    });
    
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
    
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });

    // Background scheduler: periodically process pending staff allotment requests
    const allotService = new StaffAllotmentService();
    setInterval(() => {
      allotService.processPendingRequests().catch((e) => console.error('Allotment scheduler error', e));
    }, 60 * 1000);
  } catch (err) {
    console.error('Error during server initialization:', err);
    throw err;
  }
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
