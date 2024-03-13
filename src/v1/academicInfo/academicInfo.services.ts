import { AcademicInfo, Role, Prisma, Semester } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma';
import ApiError from '../../utils/apiError';

/**
 * Create a academicInfo
 * @param {Object} academicInfoBody
 * @returns {Promise<AcademicInfo>}
 */
const createAcademicInfo = async (
  name: string,
  startDate: Date,
  endDate: Date
): Promise<AcademicInfo> => {
  // if (await getAcademicInfoByName(name)) {
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     `AcademicInfo "${name}" already exists. Please Try Again!`
  //   );
  // }
  return prisma.academicInfo.create({ data: { name, startDate, endDate } });
};

/**
 * Create a academicInfo
 * @param {Object} semesterBody
 * @returns {Promise<AcademicInfo>}
 */
const createSemester = async (
  name: string,
  startDate: Date,
  closureDate: Date,
  finalClosureDate: Date,
  academicInfoId: number
): Promise<Semester> => {
  return prisma.semester.create({
    data: {
      name,
      startDate,
      closureDate,
      finalClosureDate,
      academicInfoId
    }
  });
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
  }
): Promise<{
  page: number;
  limit: number;
  count: number;
  totalPages: number;
  academicInfos: Pick<AcademicInfo, Key>[];
}> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const count: number = await prisma.academicInfo.count({ where: filter });

  const academicInfos = await prisma.academicInfo.findMany({
    where: filter,
    include: { semesters: true },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });

  const totalPages: number = Math.ceil(count / limit);

  return {
    page,
    limit,
    count,
    totalPages,
    academicInfos: academicInfos as Pick<AcademicInfo, Key>[]
  };
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
    throw new ApiError(httpStatus.NOT_FOUND, 'AcademicInfo is not found');
  }
  return academicInfo as Promise<Pick<AcademicInfo, Key>>;
};

/**
 * Get academicInfo with semester by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<AcademicInfo, Key> | null>}
 */
const getAcademicInfoWithSemesterById = async <Key extends keyof AcademicInfo>(
  id: number,
  keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt', 'semesters'] as Key[]
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
  keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt', 'semesters'] as Key[]
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
 * Update academicInfo by id
 * @param {ObjectId} semesterId
 * @param {Object} updateBody
 * @returns {Promise<Semester>}
 */
const updateSemesterById = async <Key extends keyof Semester>(
  semesterId: number,
  updateBody: Prisma.SemesterUpdateInput,
  keys: Key[] = [
    'id',
    'name',
    'startDate',
    'closureDate',
    'finalClosureDate',
    'academicInfoId',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Semester, Key> | null> => {
  const academicInfo = await getAcademicInfoById(semesterId, ['id', 'name']);
  // if (updateBody.name && (await getAcademicInfoByName(updateBody.name as string))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  const updatedSemester = await prisma.semester.update({
    where: { id: academicInfo.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedSemester as Pick<Semester, Key> | null;
};

/**
 * Delete academicInfo by id
 * @param {ObjectId} academicInfoId
 * @returns {Promise<AcademicInfo>}
 */
const deleteAcademicInfoById = async (academicInfoId: number): Promise<AcademicInfo> => {
  // TODO: Need to check Idea is created or not within Semester to Delete
  const academicInfo = await getAcademicInfoById(academicInfoId);

  await prisma.semester.deleteMany({ where: { academicInfoId: academicInfo.id } });

  await prisma.academicInfo.delete({ where: { id: academicInfo.id } });
  return academicInfo;
};

export default {
  createAcademicInfo,
  createSemester,
  queryAcademicInfos,
  getAcademicInfoById,
  getAcademicInfoWithSemesterById,
  updateAcademicInfoById,
  updateSemesterById,
  deleteAcademicInfoById
};
