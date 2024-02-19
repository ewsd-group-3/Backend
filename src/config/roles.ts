import { Role } from '@prisma/client';

const allRoles = {
  [Role.STAFF]: ['staff'],
  [Role.QA_COORDINATOR]: ['getReports', 'getAnnouncements', 'manageAnnouncements'],
  [Role.QA_MANAGER]: ['getCategories', 'manageCategories', 'getReports'],
  [Role.ADMIN]: ['getStaffs', 'manageStaffs', 'getDepartments', 'manageDepartments']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
