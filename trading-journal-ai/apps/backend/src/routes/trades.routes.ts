import { Router } from 'express';
import { TradesController } from '../controllers/trades.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createTradeSchema, updateTradeSchema } from '../validators/trade.validator';

const router: Router = Router();
const tradesController = new TradesController();

router.post('/', validateRequest(createTradeSchema), tradesController.createTrade);
router.get('/', tradesController.getTrades);
router.get('/stats', tradesController.getTradeStats);
router.get('/:id', tradesController.getTrade);
router.put('/:id', validateRequest(updateTradeSchema), tradesController.updateTrade);
router.delete('/:id', tradesController.deleteTrade);

export default router;