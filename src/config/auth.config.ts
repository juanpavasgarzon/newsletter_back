import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  adminSecret: process.env.ADMIN_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresInSeconds: parseInt(process.env.JWT_EXPIRES_IN_SECONDS!, 10),
}));
