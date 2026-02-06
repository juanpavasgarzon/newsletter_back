import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!, 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  from: process.env.SMTP_FROM,
  frontendUrl: process.env.FRONTEND_URL,
}));
