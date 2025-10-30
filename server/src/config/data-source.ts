import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,      // should be "db"
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,  // must be "medflow"
  synchronize: !isProd, 
  logging: true,  // Enable logging to debug connection issues
  entities: [
    __dirname + '/../entities/*.{ts,js}'
  ],
  migrations: [
    __dirname + '/../migrations/*.{ts,js}'
  ],
});
