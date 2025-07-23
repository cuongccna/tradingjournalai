import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const assetTypes = ['stock', 'forex', 'crypto', 'option', 'future'];
const sides = ['buy', 'sell'];

export const createTradeSchema = Joi.object({
  symbol: Joi.string().uppercase().required(),
  assetType: Joi.string().valid(...assetTypes).required(),
  side: Joi.string().valid(...sides).required(),
  quantity: Joi.number().positive().required(),
  entryPrice: Joi.number().positive().required(),
  exitPrice: Joi.number().positive().optional(),
  entryDate: Joi.string().required(),
  exitDate: Joi.string().optional(),
  status: Joi.string().valid('open', 'closed').default('open'),
  strategy: Joi.string().default(''),
  notes: Joi.string().max(5000).default(''),
  tags: Joi.array().items(Joi.string()).default([]),
});

export const updateTradeSchema = Joi.object({
  symbol: Joi.string().uppercase().optional(),
  assetType: Joi.string().valid(...assetTypes).optional(),
  side: Joi.string().valid(...sides).optional(),
  quantity: Joi.number().positive().optional(),
  entryPrice: Joi.number().positive().optional(),
  exitPrice: Joi.number().positive().optional(),
  entryDate: Joi.string().optional(),
  exitDate: Joi.string().optional(),
  status: Joi.string().valid('open', 'closed').optional(),
  strategy: Joi.string().optional(),
  notes: Joi.string().max(5000).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

// Validation middleware
export const validateTrade = (req: Request, res: Response, next: NextFunction) => {
  const isUpdate = req.method === 'PUT' || req.method === 'PATCH';
  const schema = isUpdate ? updateTradeSchema : createTradeSchema;
  
  const { error, value } = schema.validate(req.body, { 
    abortEarly: false,
    stripUnknown: true 
  });
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail: any) => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.body = value;
  next();
};