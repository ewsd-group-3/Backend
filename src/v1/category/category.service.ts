import { Category, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma';
import ApiError from '../../utils/apiError';

/**
 * Create a Category
 * @param {Object} CategoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (name: string): Promise<Category> => {
  if (await getCategoryByName(name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Category's name is already taken");
  }
  return prisma.category.create({ data: { name } });
};

/**
 * Query for Categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async <Key extends keyof Category>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
): Promise<{ count: number; categories: Pick<Category, Key>[] }> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const count: number = await prisma.category.count({ where: filter });

  const categories = await prisma.category.findMany({
    where: filter,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });

  return { count, categories: categories as Pick<Category, Key>[] };
};

/**
 * Get Category by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Category, Key>>}
 */
const getCategoryById = async <Key extends keyof Category>(
  id: number
): Promise<Pick<Category, Key>> => {
  const category = prisma.category.findUnique({ where: { id } });
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category is not found');
  return category as Promise<Pick<Category, Key>>;
};

/**
 * Get Category by name
 * @param {string} name
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Category, Key> | null>}
 */
const getCategoryByName = async <Key extends keyof Category>(
  name: string,
  keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Category, Key> | null> => {
  return prisma.category.findUnique({
    where: { name },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Category, Key> | null>;
};

/**
 * Update Category by id
 * @param {ObjectId} CategoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async <Key extends keyof Category>(
  categoryId: number,
  updateBody: Prisma.CategoryUpdateInput,
  keys: Key[] = ['id', 'name'] as Key[]
): Promise<Pick<Category, Key>> => {
  const category = await getCategoryById(categoryId);
  if (updateBody.name && (await getCategoryByName(updateBody.name as string))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category is already taken');
  }
  const updatedCategory = await prisma.category.update({
    where: { id: category.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedCategory as Pick<Category, Key>;
};

/**
 * Delete Category by id
 * @param {ObjectId} CategoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (CategoryId: number): Promise<Category> => {
  const category = await getCategoryById(CategoryId);
  // TODO: Search in Idea Table if category is used or not
  await prisma.category.delete({ where: { id: category.id } });
  return category;
};

export default {
  createCategory,
  queryCategories,
  getCategoryById,
  getCategoryByName,
  updateCategoryById,
  deleteCategoryById
};
