import { Router } from 'express';
import {
  createCategory,
  deleteCateogry,
  getAllCategories,
  getCategoryById,
  updateCategory
} from '../controllers/category.controller';
import { verifyJWT } from '../middlewares';

const router = Router();

router.get('/', getAllCategories);
router.get('/:categoryId', getCategoryById);
router.post('/', verifyJWT, createCategory);
router.put('/:categoryId', verifyJWT, updateCategory);
router.delete('/:categoryId', verifyJWT, deleteCateogry);

export default router;
