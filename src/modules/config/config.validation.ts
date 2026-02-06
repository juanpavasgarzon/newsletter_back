import Joi from 'joi';

const aboutSectionSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

export const basicInfoFileSchema = Joi.object({
  name: Joi.string().required(),
  role: Joi.string().required(),
  startYear: Joi.number().integer().required(),
  github: Joi.string().required(),
  linkedin: Joi.string().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
});

export const logoFileSchema = Joi.object({
  logoUrl: Joi.string().required(),
});

export const aboutFileSchema = Joi.object({
  title: Joi.string().allow(''),
  subtitle: Joi.string().allow(''),
  sections: Joi.array().items(aboutSectionSchema).default([]),
});
