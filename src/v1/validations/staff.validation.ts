import { Role } from '@prisma/client';
import Joi from 'joi';
import { password } from './custom.validation';

const createStaff = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid(Role.STAFF, Role.ADMIN)
  })
};

const getStaffs = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
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
      name: Joi.string()
    })
    .min(1)
};

const deleteStaff = {
  params: Joi.object().keys({
    staffId: Joi.number().integer()
  })
};

export default {
  createStaff,
  getStaffs,
  getStaff,
  updateStaff,
  deleteStaff
};
