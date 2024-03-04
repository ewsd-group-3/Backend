import { AcademicInfo, Role, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma';
import ApiError from '../../utils/ApiError';

/**
 * Create a academicInfo
 * @param {Object} academicInfoBody
 * @returns {Promise<AcademicInfo>}
 */
const createAcademicInfo = async (name: string): Promise<AcademicInfo> => {
  // if (await getAcademicInfoByName(name)) {
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     `AcademicInfo "${name}" already exists. Please Try Again!`
  //   );
  // }
  return prisma.academicInfo.create({ data: { name } });
};

/**
 * Query for academicInfos
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAcademicInfos = async <Key extends keyof AcademicInfo>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<AcademicInfo, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const academicInfos = await prisma.academicInfo.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return academicInfos as Pick<AcademicInfo, Key>[];
};

/**
 * Get academicInfo by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<AcademicInfo, Key> | null>}
 */
const getAcademicInfoById = async <Key extends keyof AcademicInfo>(
  id: number,
  keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<AcademicInfo, Key>> => {
  const academicInfo = await prisma.academicInfo.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  if (!academicInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AcademicInfo not found');
  }
  return academicInfo as Promise<Pick<AcademicInfo, Key>>;
};

/**
 * Get academicInfo by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<AcademicInfo, Key> | null>}
 */
// const getAcademicInfoByName = async <Key extends keyof AcademicInfo>(
//   name: string,
//   keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
// ): Promise<Pick<AcademicInfo, Key> | null> => {
//   return prisma.academicInfo.findUnique({
//     where: { name },
//     select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
//   }) as Promise<Pick<AcademicInfo, Key> | null>;
// };

/**
 * Update academicInfo by id
 * @param {ObjectId} academicInfoId
 * @param {Object} updateBody
 * @returns {Promise<AcademicInfo>}
 */
const updateAcademicInfoById = async <Key extends keyof AcademicInfo>(
  academicInfoId: number,
  updateBody: Prisma.AcademicInfoUpdateInput,
  keys: Key[] = ['id', 'email', 'name', 'role'] as Key[]
): Promise<Pick<AcademicInfo, Key> | null> => {
  const academicInfo = await getAcademicInfoById(academicInfoId, ['id', 'name']);
  // if (updateBody.name && (await getAcademicInfoByName(updateBody.name as string))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  const updatedAcademicInfo = await prisma.academicInfo.update({
    where: { id: academicInfo.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedAcademicInfo as Pick<AcademicInfo, Key> | null;
};

/**
 * Delete academicInfo by id
 * @param {ObjectId} academicInfoId
 * @returns {Promise<AcademicInfo>}
 */
const deleteAcademicInfoById = async (academicInfoId: number): Promise<AcademicInfo> => {
  const academicInfo = await getAcademicInfoById(academicInfoId);
  await prisma.academicInfo.delete({ where: { id: academicInfo.id } });
  return academicInfo;
};

export default {
  createAcademicInfo,
  queryAcademicInfos,
  getAcademicInfoById,
  updateAcademicInfoById,
  deleteAcademicInfoById
};
