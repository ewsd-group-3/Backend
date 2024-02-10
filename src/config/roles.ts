import { Role } from '@prisma/client';

const allRoles = {
  [Role.STAFF]: [],
  [Role.ADMIN]: ['getStaffs', 'manageStaffs']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
