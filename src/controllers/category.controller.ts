import { Category } from '../models';
import { ApiError, ApiResponse, asyncHandler } from '../utils';

const getAllCategories = asyncHandler(async (_, res) => {
  const categories = await Category.find();
  res.status(200).json(new ApiResponse(200, { categories }));
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(404, 'Category not found');

  res.status(200).json(new ApiResponse(200, category));
});

const createCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName) throw new ApiError(400, 'Category name is required');

  const ownerId = req.user?._id;
  if (!ownerId) throw new ApiError(400, 'User Id is required');

  const category = await Category.create({
    categoryName,
    owner: ownerId
  });

  res.status(200).json(new ApiResponse(200, category));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { categoryName } = req.body;

  if (!categoryId) {
    throw new ApiError(400, 'Cateogry Id is required');
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    {
      $set: {
        categoryName
      }
    },
    { new: true }
  );

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.status(200).json(new ApiResponse(200, category));
});

const deleteCateogry = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    throw new ApiError(400, 'Cateogry Id is required');
  }

  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.status(200).json(new ApiResponse(200, category));
});

export {
  createCategory,
  deleteCateogry,
  getAllCategories,
  getCategoryById,
  updateCategory
};
