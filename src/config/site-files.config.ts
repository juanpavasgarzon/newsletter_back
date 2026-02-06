import { registerAs } from '@nestjs/config';

export default registerAs('siteFiles', () => ({
  configDir: process.env.CONFIG_DIR,
}));
