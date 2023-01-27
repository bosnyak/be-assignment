import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Organization } from '../entities/organization';
import { Shipment } from '../entities/shipment';
import { TransportPack } from '../entities/transportPack';

dotenv.config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Organization, Shipment, TransportPack],
  migrations: [],
  subscribers: [],
});
