import { Router } from 'express';
import { createItem, getItem, listItems, updateItemStatus } from '../controllers/itemController.js';

const router = Router();
router.get('/', listItems);
router.post('/', createItem);
router.get('/:id', getItem);
router.patch('/:id/status', updateItemStatus);
export default router;
