import { Role } from '@prisma/client';
import Joi from 'joi';
import { password } from '../auth/custom.validation';

const createStaff = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    departmentId: Joi.number().required(),
    role: Joi.string()
      .required()
      .valid(Role.STAFF, Role.QA_COORDINATOR, Role.QA_MANAGER, Role.ADMIN)
  })
};

const getStaffs = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    sortType: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    name: Joi.string(),
    email: Joi.string(),
    role: Joi.string(),
    isActive: Joi.boolean(),
    departmentId: Joi.number()
  })
};

const getStaff = {
  params: Joi.object().keys({
    staffId: Joi.number().integer()
  })
};

const updateStaff = {
  params: Joi.object().keys({
    staffId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      role: Joi.string(),
      departmentId: Joi.number()
    })
    .min(1)
};

const deleteStaff = {
  params: Joi.object().keys({
    staffId: Joi.number().integer()
  })
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().custom(password).required()
  })
};

const resetPassword = {
  params: Joi.object().keys({
    staffId: Joi.number().integer()
  })
};

const uploadProfile = {
  body: Joi.object().keys({
    profile: Joi.object()
      .keys({
        name: Joi.string().required(),
        documenttype: Joi.string().required(),
        documentDownloadUrl: Joi.string().required(),
        documentDeleteUrl: Joi.string().required()
      })
      .required()
  })
};

export default {
  createStaff,
  getStaffs,
  getStaff,
  updateStaff,
  deleteStaff,
  changePassword,
  resetPassword,
  uploadProfile
};
