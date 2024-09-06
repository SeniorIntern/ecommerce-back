import { clear } from 'console';
import { PRODUCT_MAX_SUBIMAGES } from '../constants';
import { Category } from '../models';
import { Product } from '../models/product.model';
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  uploadOnCloudinary
} from '../utils';

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

  // TODO : validation
  const { productName, category, description, price, stock } = req.body;

  const categoryToBeAdded = await Category.findById(category);
  if (!categoryToBeAdded) {
    throw new ApiError(404, 'Category does not exist');
  }

  if (!req.files) {
    throw new ApiError(400, 'No images found');
  }

  if (!('mainImage' in req.files) || !req.files.mainImage.length) {
    throw new ApiError(400, 'Main image is required');
  }

  if (!('subImages' in req.files) || !req.files.subImages.length) {
    throw new ApiError(400, 'Sub images are required');
  }

  if (req.files.subImages.length > PRODUCT_MAX_SUBIMAGES) {
    throw new ApiError(
      400,
      `Sub images should be maximum of ${PRODUCT_MAX_SUBIMAGES}.`
    );
  }

  const mainImageLocalPath = req.files.mainImage;
  const subImagesLocalPath = req.files.subImages;
  /*
  path is an array of multer file{} 
  [
    {
      fieldname: 'mainImage',
      originalname: 'abc.jpg_720x720q80.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './public/temp',
      filename: 'abc.jpg_720x720q80.jpg',
      path: 'public/temp/abc.jpg_720x720q80.jpg',
      size: 35942
    }
  ];
  */
  // console.log('mainImageLocalPath===', mainImageLocalPath);
  // console.log('subImagesLocalPath===', subImagesLocalPath);

  const mainImage = await uploadOnCloudinary(mainImageLocalPath[0].path);
  if (!mainImage) {
    throw new ApiError(400, 'Main Image failed to upload');
  }
  const mainImageUrl = mainImage.url;

  let subImages = [];
  for (let i = 0; i < subImagesLocalPath.length; i++) {
    console.log(`local path of sub img ${i}===`, subImagesLocalPath[i].path);

    const url = await uploadOnCloudinary(subImagesLocalPath[i].path);
    if (!url) {
      throw new ApiError(400, 'Image upload failed');
    }
    subImages.push(url);
  }
  if (!subImages.length) {
    throw new ApiError(400, 'Sub images failed to upload');
  }
  const subImageUrls = subImages.map((img) => img.url);
  console.log('subImageUrls===', subImageUrls);

  const product = await Product.create({
    productName,
    owner: ownerId,
    category,
    description,
    price,
    stock,
    mainImage: mainImageUrl,
    subImages: subImageUrls
  });
  return res.status(200).json(new ApiResponse(200, product));
});

const patchProduct = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id;
  if (!ownerId) throw new ApiError(400, 'User not found');

  const { productId } = req.params;
  if (!productId) throw new ApiError(400, 'Product Id is required');

  const { productName, category, description, price, stock } = req.body;

  const categoryToBeAdded = await Category.findById(category);
  if (!categoryToBeAdded) {
    throw new ApiError(404, 'Category does not exist');
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        productName,
        owner: ownerId,
        category,
        description,
        price,
        stock
      }
    },
    { new: true }
  );

  if (!product) throw new ApiError(400, 'Product is not found');

  res.status(200).json(new ApiResponse(200, product));
});

const patchProductImages = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id;
  if (!ownerId) throw new ApiError(400, 'User not found');

  const { productId } = req.params;
  if (!productId) throw new ApiError(400, 'Product Id is required');

  if (!req.files) {
    throw new ApiError(400, 'No images found');
  }

  if (!('mainImage' in req.files) || !req.files.mainImage.length) {
    throw new ApiError(400, 'Main image is required');
  }

  if (!('subImages' in req.files) || !req.files.subImages.length) {
    throw new ApiError(400, 'Sub images are required');
  }

  if (req.files.subImages.length > PRODUCT_MAX_SUBIMAGES) {
    throw new ApiError(
      400,
      `Sub images should be maximum of ${PRODUCT_MAX_SUBIMAGES}.`
    );
  }

  const mainImageLocalPath = req.files.mainImage;
  const subImagesLocalPath = req.files.subImages;

  const mainImage = await uploadOnCloudinary(mainImageLocalPath[0].path);
  if (!mainImage) {
    throw new ApiError(400, 'Main Image failed to upload');
  }
  const mainImageUrl = mainImage.url;

  let subImages = [];
  for (let i = 0; i < PRODUCT_MAX_SUBIMAGES; i++) {
    const url = await uploadOnCloudinary(subImagesLocalPath[i].path);
    if (!url) {
      throw new ApiError(400, 'Image upload failed');
    }
    subImages.push(url);
  }
  if (!subImages.length) {
    throw new ApiError(400, 'Sub images failed to upload');
  }
  const subImageUrls = subImages.map((img) => img.url);

  const product = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        mainImage: mainImageUrl,
        subImages: subImageUrls
      }
    },
    { new: true }
  );

  if (!product) throw new ApiError(400, 'Product is not found');
  return res.status(200).json(new ApiResponse(200, product));
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
  patchProduct,
  patchProductImages
};
