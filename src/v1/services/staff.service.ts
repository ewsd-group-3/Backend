import { Staff, Role, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma';
import ApiError from '../../utils/ApiError';
import { encryptPassword } from '../../utils/encryption';

/**
 * Create a staff
 * @param {Object} staffBody
 * @returns {Promise<Staff>}
 */
const createStaff = async (
  email: string,
  password: string,
  name?: string,
  role: Role = Role.STAFF
): Promise<Staff> => {
  if (await getStaffByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return prisma.staff.create({
    data: {
      email,
      name,
      password: await encryptPassword(password),
      role
    }
  });
};

/**
 * Query for staffs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryStaffs = async <Key extends keyof Staff>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'email',
    'name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Staff, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const staffs = await prisma.staff.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return staffs as Pick<Staff, Key>[];
};

/**
 * Get staff by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Staff, Key> | null>}
 */
const getStaffById = async <Key extends keyof Staff>(
  id: number,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Staff, Key> | null> => {
  return prisma.staff.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Staff, Key> | null>;
};

/**
 * Get staff by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Staff, Key> | null>}
 */
const getStaffByEmail = async <Key extends keyof Staff>(
  email: string,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Staff, Key> | null> => {
  return prisma.staff.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Staff, Key> | null>;
};

/**
 * Update staff by id
 * @param {ObjectId} staffId
 * @param {Object} updateBody
 * @returns {Promise<Staff>}
 */
const updateStaffById = async <Key extends keyof Staff>(
  staffId: number,
  updateBody: Prisma.StaffUpdateInput,
  keys: Key[] = ['id', 'email', 'name', 'role'] as Key[]
): Promise<Pick<Staff, Key> | null> => {
  const staff = await getStaffById(staffId, ['id', 'email', 'name']);
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Staff not found');
  }
  if (updateBody.email && (await getStaffByEmail(updateBody.email as string))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const updatedStaff = await prisma.staff.update({
    where: { id: staff.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedStaff as Pick<Staff, Key> | null;
};

/**
 * Delete staff by id
 * @param {ObjectId} staffId
 * @returns {Promise<Staff>}
 */
const deleteStaffById = async (staffId: number): Promise<Staff> => {
  const staff = await getStaffById(staffId);
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Staff not found');
  }
  await prisma.staff.delete({ where: { id: staff.id } });
  return staff;
};

export default {
  createStaff,
  queryStaffs,
  getStaffById,
  getStaffByEmail,
  updateStaffById,
  deleteStaffById
};
