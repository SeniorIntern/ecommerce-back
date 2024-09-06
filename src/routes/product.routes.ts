import { Router } from 'express';
import { PRODUCT_MAX_SUBIMAGES } from '../constants';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  patchProduct,
  patchProductImages
} from '../controllers/product.controller';
import { upload, verifyJWT } from '../middlewares';

const router = Router();

router.get('/', getAllProducts);

router.get('/:productId', getProductById);

router.route('/category/:categoryId').get(getProductsByCategory)

router.post(
  '/',
  verifyJWT,
  upload.fields([
    {
      name: 'mainImage',
      maxCount: 1
    },
    {
      name: 'subImages',
      maxCount: PRODUCT_MAX_SUBIMAGES
    }
  ]),
  createProduct
);

router.patch('/:productId', verifyJWT, patchProduct);

router.patch(
  '/images/:productId',
  verifyJWT,
  upload.fields([
    {
      name: 'mainImage',
      maxCount: 1
    },
    {
      name: 'subImages',
      maxCount: PRODUCT_MAX_SUBIMAGES
    }
  ]),
  patchProductImages
);
router.delete('/:productId', verifyJWT, deleteProduct);

export default router;
