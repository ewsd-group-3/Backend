import { Role } from '@prisma/client';
import Joi from 'joi';
import { password } from '../auth/custom.validation';

const createDepartment = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid(Role.STAFF, Role.ADMIN)
  })
};

const getDepartments = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getDepartment = {
  params: Joi.object().keys({
    departmentId: Joi.number().integer()
  })
};

const updateDepartment = {
  params: Joi.object().keys({
    departmentId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string()
    })
    .min(1)
};

const deleteDepartment = {
  params: Joi.object().keys({
    departmentId: Joi.number().integer()
  })
};

export default {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment
};
