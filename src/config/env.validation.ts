import Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  API_PREFIX: Joi.string().required(),
  COOKIE_SECRET: Joi.string().optional().allow(''),
  DATABASE_URL: Joi.string().required(),
  ADMIN_SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN_SECONDS: Joi.string().required(),
  CONFIG_DIR: Joi.string().required(),
  SMTP_HOST: Joi.string().optional().allow(''),
  SMTP_PORT: Joi.string().optional().allow(''),
  SMTP_SECURE: Joi.string().optional().allow(''),
  SMTP_USER: Joi.string().optional().allow(''),
  SMTP_PASS: Joi.string().optional().allow(''),
  SMTP_FROM: Joi.string().optional().allow(''),
  FRONTEND_URL: Joi.string().optional().allow(''),
}).options({ allowUnknown: true });
