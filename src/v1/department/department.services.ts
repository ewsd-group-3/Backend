import { Department, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma';
import ApiError from '../../utils/apiError';

/**
 * Create a department
 * @param {Object} departmentBody
 * @returns {Promise<Department>}
 */
const createDepartment = async (name: string): Promise<Department> => {
  if (await getDepartmentByName(name)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Department "${name}" already exists. Please Try Again!`
    );
  }
  return prisma.department.create({ data: { name } });
};

/**
 * Query for departments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDepartments = async <Key extends keyof Department>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
): Promise<{ count: number; departments: Pick<Department, Key>[] }> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const count: number = await prisma.department.count({ where: filter });

  const departments = await prisma.department.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });

  return { count, departments: departments as Pick<Department, Key>[] };
};

/**
 * Get department by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Department, Key> | null>}
 */
const getDepartmentById = async <Key extends keyof Department>(
  id: number,
  keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Department, Key>> => {
  const department = await prisma.department.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  if (!department) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Department is not found');
  }
  return department as Promise<Pick<Department, Key>>;
};

/**
 * Get department by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Department, Key> | null>}
 */
const getDepartmentByName = async <Key extends keyof Department>(
  name: string,
  keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Department, Key> | null> => {
  return prisma.department.findUnique({
    where: { name },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Department, Key> | null>;
};

/**
 * Update department by id
 * @param {ObjectId} departmentId
 * @param {Object} updateBody
 * @returns {Promise<Department>}
 */
const updateDepartmentById = async <Key extends keyof Department>(
  departmentId: number,
  updateBody: Prisma.DepartmentUpdateInput,
  keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Department, Key>> => {
  const department = await getDepartmentById(departmentId);
  if (updateBody.name && (await getDepartmentByName(updateBody.name as string))) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Department ${updateBody.name} is already taken`);
  }
  const updatedDepartment = await prisma.department.update({
    where: { id: department.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedDepartment as Pick<Department, Key>;
};

/**
 * Delete department by id
 * @param {ObjectId} departmentId
 * @returns {Promise<Department>}
 */
const deleteDepartmentById = async (departmentId: number): Promise<Department> => {
  const department = await getDepartmentById(departmentId);
  await prisma.department.delete({ where: { id: department.id } });
  return department;
};

export default {
  createDepartment,
  queryDepartments,
  getDepartmentById,
  getDepartmentByName,
  updateDepartmentById,
  deleteDepartmentById
};
