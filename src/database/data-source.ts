import 'dotenv/config';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { getDatabaseOptionsFromEnv } from '../config/database.config';

const { path: databasePath, logging } = getDatabaseOptionsFromEnv();

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: databasePath,
  entities: [path.join(__dirname, '..', 'modules', '*', 'entities', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logging,
});

export default AppDataSource;
