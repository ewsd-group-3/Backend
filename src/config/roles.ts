import { Role } from '@prisma/client';

const allRoles = {
  [Role.STAFF]: ['STAFF'],
  [Role.QA_COORDINATOR]: ['STAFF', 'QA_COORDINATOR'],
  [Role.QA_MANAGER]: ['STAFF', 'QA_MANAGER'],
  [Role.ADMIN]: ['STAFF', 'ADMIN']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
