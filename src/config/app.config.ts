import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT!, 10),
  nodeEnv: process.env.NODE_ENV!,
  apiPrefix: process.env.API_PREFIX!,
  corsOrigin: process.env.FRONTEND_URL,
  cookieSecret: process.env.COOKIE_SECRET,
}));
