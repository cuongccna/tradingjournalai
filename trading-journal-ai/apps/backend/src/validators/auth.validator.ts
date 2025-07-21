import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  displayName: Joi.string().min(2).max(50),
});

export const updateProfileSchema = Joi.object({
  displayName: Joi.string().min(2).max(50),
});