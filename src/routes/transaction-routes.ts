import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware.js';
import { create, list, remove, update } from '../controllers/transaction-controller.js';

const router = Router();

router.use(authMiddleware);

router.post('/', create);
router.get('/', list);
router.patch('/:transactionId', update);
router.delete('/:id', remove);

export default router;