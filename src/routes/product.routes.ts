import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  patchProduct
} from '../controllers/product.controller';
import { verifyJWT } from '../middlewares';

const router = Router();

router.get('/', getAllProducts);
router.get('/:productId', getProductById);
router.post('/', verifyJWT, createProduct);
router.patch('/:productId', verifyJWT, patchProduct);
router.delete('/:productId', verifyJWT, deleteProduct);

export default router;
