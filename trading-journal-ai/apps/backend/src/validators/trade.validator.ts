import Joi from 'joi';

const assetTypes = ['stock', 'forex', 'crypto', 'futures', 'options'];
const sides = ['buy', 'sell', 'long', 'short'];

export const createTradeSchema = Joi.object({
  accountId: Joi.string().required(),
  assetType: Joi.string().valid(...assetTypes).required(),
  symbol: Joi.string().uppercase().required(),
  side: Joi.string().valid(...sides).required(),
  size: Joi.number().positive().required(),
  entryPrice: Joi.number().positive().required(),
  entryDateTime: Joi.date().iso().required(),
  exitPrice: Joi.number().positive().optional(),
  exitDateTime: Joi.date().iso().optional(),
  stopLoss: Joi.number().positive().optional(),
  takeProfit: Joi.number().positive().optional(),
  commission: Joi.number().min(0).optional(),
  fees: Joi.number().min(0).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  strategyId: Joi.string().optional(),
  notes: Joi.string().max(5000).optional(),
  timezone: Joi.string().default('UTC'),
  currency: Joi.string().length(3).uppercase().default('USD'),
});

export const updateTradeSchema = Joi.object({
  assetType: Joi.string().valid(...assetTypes).optional(),
  symbol: Joi.string().uppercase().optional(),
  side: Joi.string().valid(...sides).optional(),
  size: Joi.number().positive().optional(),
  entryPrice: Joi.number().positive().optional(),
  entryDateTime: Joi.date().iso().optional(),
  exitPrice: Joi.number().positive().optional(),
  exitDateTime: Joi.date().iso().optional(),
  stopLoss: Joi.number().positive().optional(),
  takeProfit: Joi.number().positive().optional(),
  commission: Joi.number().min(0).optional(),
  fees: Joi.number().min(0).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  strategyId: Joi.string().optional(),
  notes: Joi.string().max(5000).optional(),
});