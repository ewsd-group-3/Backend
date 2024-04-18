import { Staff, Role, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma';
import ApiError from '../../utils/apiError';
import { encryptPassword, isPasswordMatch } from '../../utils/encryption';
import { defaultPassword } from '../../constants/message.constant';

/**
 * Create a staff
 * @param {Object} staffBody
 * @returns {Promise<Staff>}
 */
const createStaff = async (
  email: string,
  name: string,
  departmentId: number,
  role: Role
): Promise<Staff> => {
  if (await getStaffByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
  }

  const adminStaff = await getAdminStaff();
  const qaMgrStaff = await getQAManagerStaff();

  if ((role === 'ADMIN' && adminStaff) || (role === 'QA_MANAGER' && qaMgrStaff)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot create two active ${role}s.`);
  }

  if (role === 'QA_COORDINATOR') {
    const qa_coordinator = await findQACoordinatorStaff(departmentId);
    if (qa_coordinator)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot create two active QA Coordinators in one Department!`
      );
  }

  return prisma.staff.create({
    data: {
      email,
      name,
      password: await encryptPassword(defaultPassword),
      departmentId,
      role
    },
    include: {
      department: {
        select: { id: true, name: true }
      }
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
  }
): Promise<{
  page: number;
  limit: number;
  count: number;
  totalPages: number;
  staffs: Pick<Staff, Key>[];
}> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 5;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const count: number = await prisma.staff.count({ where: filter });
  const totalPages: number = Math.ceil(count / limit);

  const staffs = await prisma.staff.findMany({
    where: filter,
    include: { department: true },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });

  return { page, limit, count, totalPages, staffs: staffs as Pick<Staff, Key>[] };
};

/**
 * Get staff by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Staff, Key> | null>}
 */
const getStaffById = async <Key extends keyof Staff>(id: number): Promise<Pick<Staff, Key>> => {
  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      department: {
        select: { id: true, name: true }
      }
    }
  });
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Staff is not found');
  }
  return staff;
};

/**
 * Get staff by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Staff, Key> | null>}
 */
const getStaffByEmail = async <Key extends keyof Staff>(
  email: string,
  keys: Key[] = ['id', 'email', 'name', 'password', 'role', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Staff, Key> | null> => {
  return (await prisma.staff.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  })) as Promise<Pick<Staff, Key> | null>;
};

/**
 * Get staff by email
 * @param {number} departmentId
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Staff, Key> | null>}
 */
const getQACoordinatorStaffByDepartmentId = async <Key extends keyof Staff>(
  departmentId: number
): Promise<Pick<Staff, Key> | null> => {
  return await prisma.staff.findFirst({
    where: { departmentId, role: 'QA_COORDINATOR' },
    include: { department: true }
    // select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
};

/**
 * Update staff by id
 * @param {ObjectId} staffId
 * @param {Object} updateBody
 * @returns {Promise<Staff>}
 */
const updateStaffById = async <Key extends keyof Staff>(
  staffId: number,
  updateBody: Prisma.StaffUncheckedUpdateInput
  // keys: Key[] = ['id', 'email', 'name', 'role'] as Key[]
): Promise<Pick<Staff, Key>> => {
  const staff = await getStaffById(staffId);

  // Email Validate
  if (
    updateBody.email &&
    staff.email !== updateBody.email &&
    (await getStaffByEmail(updateBody.email as string))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // Role Validate
  const adminStaff = await getAdminStaff();
  const qaMgrStaff = await getQAManagerStaff();

  if (updateBody.role) {
    if (
      (updateBody.role === 'ADMIN' && adminStaff && staff.id !== adminStaff.id) ||
      (updateBody.role === 'QA_MANAGER' && qaMgrStaff && staff.id !== qaMgrStaff.id)
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot update Role because the system have already active ${updateBody.role} in the System!`
      );
    }

    if (updateBody.role === 'QA_COORDINATOR') {
      let qa_coordinator = null;
      if (updateBody.departmentId && staff.departmentId !== updateBody.departmentId) {
        qa_coordinator = await findQACoordinatorStaff(Number(updateBody.departmentId));
      } else {
        qa_coordinator = await findQACoordinatorStaff(staff.departmentId);
      }
      if (qa_coordinator && qa_coordinator.id !== staff.id)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Cannot update Role because the system have already active ${updateBody.role} in the System!`
        );
    }
  }

  const updatedStaff = await prisma.staff.update({
    where: { id: staff.id },
    data: updateBody,
    include: {
      department: true
    }
    // select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedStaff as Pick<Staff, Key>;
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

const toggleActive = async <Key extends keyof Staff>(
  staffId: number
  // keys: Key[] = ['id', 'email', 'name', 'role'] as Key[]
): Promise<Pick<Staff, Key>> => {
  const staff = await getStaffById(Number(staffId));

  if (staff.isActive === false) {
    const adminStaff = await getAdminStaff();
    const qaMgrStaff = await getQAManagerStaff();

    if ((staff.role === 'ADMIN' && adminStaff) || (staff.role === 'QA_MANAGER' && qaMgrStaff)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot have two active ${staff.role}s in the System.`
      );
    }

    if (staff.role === 'QA_COORDINATOR') {
      const qa_coordinator = await findQACoordinatorStaff(staff.departmentId);
      if (qa_coordinator)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Cannot have two active QA Coordinators in one Department!`
        );
    }
  }

  const updatedStaff = await prisma.staff.update({
    where: { id: staff.id },
    data: { isActive: !staff.isActive },
    include: { department: true }
    // select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });

  return updatedStaff as Pick<Staff, Key>;
};

const resetPassword = async <Key extends keyof Staff>(
  staffId: number,
  keys: Key[] = ['id', 'email', 'name', 'role'] as Key[]
): Promise<Pick<Staff, Key>> => {
  const staff = await getStaffById(staffId);

  const updatedStaff = await prisma.staff.update({
    where: { id: staff.id },
    data: { password: await encryptPassword(defaultPassword) },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });

  return updatedStaff as Pick<Staff, Key>;
};

const changePassword = async <Key extends keyof Staff>(
  staffId: number,
  oldPassword: string,
  newPassword: string,
  keys: Key[] = ['id', 'email', 'name', 'role'] as Key[]
): Promise<Pick<Staff, Key>> => {
  const staff = await getStaffById(staffId);

  if (!(await isPasswordMatch(oldPassword, staff.password as string))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect old password!');
  }

  const updatedStaff = await prisma.staff.update({
    where: { id: staff.id },
    data: { password: await encryptPassword(newPassword) },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });

  return updatedStaff as Pick<Staff, Key>;
};

const getAdminStaff = async <Key extends keyof Staff>(
  keys: Key[] = ['id', 'email', 'name', 'password', 'role', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Staff, Key> | null> => {
  const adminStaff = await prisma.staff.findFirst({
    where: { isActive: true, role: 'ADMIN' },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return adminStaff as Promise<Pick<Staff, Key> | null>;
};

const getQAManagerStaff = async <Key extends keyof Staff>(
  keys: Key[] = ['id', 'email', 'name', 'password', 'role', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Staff, Key> | null> => {
  const qaMgrStaff = prisma.staff.findFirst({
    where: { isActive: true, role: 'QA_MANAGER' },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return qaMgrStaff as Promise<Pick<Staff, Key> | null>;
};

const findQACoordinatorStaff = async <Key extends keyof Staff>(
  departmentId: number,
  keys: Key[] = ['id', 'email', 'name', 'password', 'role', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Staff, Key> | null> => {
  const qa_coordinatorStaff = await prisma.staff.findFirst({
    where: { departmentId, isActive: true, role: 'QA_COORDINATOR' },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return qa_coordinatorStaff as Promise<Pick<Staff, Key> | null>;
};

const uploadProfile = async <Key extends keyof Staff>(
  staffId: number,
  profile: object
): Promise<Pick<Staff, Key>> => {
  const staff = await getStaffById(Number(staffId));

  const updatedStaff = await prisma.staff.update({
    where: { id: staff.id },
    data: { profile: profile },
    include: {
      department: {
        select: { id: true, name: true }
      }
    }
  });
  return updatedStaff as Pick<Staff, Key>;
};

export default {
  createStaff,
  queryStaffs,
  getStaffById,
  getStaffByEmail,
  getQACoordinatorStaffByDepartmentId,
  updateStaffById,
  deleteStaffById,
  toggleActive,
  resetPassword,
  changePassword,
  uploadProfile
};
