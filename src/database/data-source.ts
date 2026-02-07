import 'dotenv/config';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { getDatabaseOptionsFromEnv } from '../config/database.config';

const { url, logging } = getDatabaseOptionsFromEnv();

const AppDataSource = new DataSource({
  type: 'postgres',
  url,
  entities: [path.join(__dirname, '..', 'modules', '*', 'entities', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logging,
});

export default AppDataSource;
