import httpStatus from 'http-status';
import categoryService from './category.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';

const createCategory = catchAsync(async (req, res) => {
  const { name } = req.body;
  const category = await categoryService.createCategory(name);
  successResponse(res, httpStatus.CREATED, AppMessage.categoryCreated, { category });
});

const getCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);
  const { count, categories } = await categoryService.queryCategories(filter, options);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    count,
    categories
  });
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category is not found');
  }
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, category);
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  successResponse(res, httpStatus.OK, AppMessage.categoryUpdated, { ...category });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.staffId);
  successResponse(res, httpStatus.NO_CONTENT, AppMessage.categoryDeleted);
});

export default {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
};
