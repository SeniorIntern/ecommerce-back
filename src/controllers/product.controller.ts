import { Product } from '../models/product.model';
import { ApiError, ApiResponse, asyncHandler } from '../utils';

const getAllProducts = asyncHandler(async (_, res) => {
  const products = await Product.find();

  return res.status(200).json(new ApiResponse(200, { products }));
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new ApiError(400, 'Product Id is required');

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  return res.status(200).json(new ApiResponse(200, product));
});

const createProduct = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id;
  if (!ownerId) throw new ApiError(400, 'User not found');

  const {
    productName,
    category,
    description,
    price,
    stock,
    mainImage,
    subImages
  } = req.body;

  const product = await Product.create({
    productName,
    owner: ownerId,
    category,
    description,
    price,
    stock,
    mainImage,
    subImages
  });
  return res.status(200).json(new ApiResponse(200, product));
});

const patchProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new ApiError(400, 'Product Id is required');

  const {
    productName,
    owner,
    category,
    description,
    price,
    stock,
    mainImage,
    subImages
  } = req.body;

  const product = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        productName,
        owner,
        category,
        description,
        price,
        stock,
        mainImage,
        subImages
      }
    },
    { new: true }
  );

  if (!product) throw new ApiError(400, 'Product is not found');

  res.status(200).json(new ApiResponse(200, product));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new ApiError(400, 'Product Id is required');

  const product = await Product.findByIdAndDelete(productId);
  if (!product) throw new ApiError(400, 'Product is not found');

  return res.status(200).json(new ApiResponse(200, product));
});

export {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  patchProduct
};
