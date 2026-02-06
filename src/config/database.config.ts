import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  path: process.env.DATABASE_PATH!,
  logging: process.env.NODE_ENV === 'development',
}));

export function getDatabaseOptionsFromEnv(): {
  path: string;
  logging: boolean;
} {
  return {
    path: process.env.DATABASE_PATH!,
    logging: process.env.NODE_ENV === 'development',
  };
}
