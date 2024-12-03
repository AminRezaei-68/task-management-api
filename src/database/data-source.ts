import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Task } from '../modules/tasks/entities/task.entity';
import { User } from '../modules/users/entities/user.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Task, User],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
