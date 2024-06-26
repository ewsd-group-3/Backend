import Joi from 'joi';

const createDepartment = {
  body: Joi.object().keys({
    name: Joi.string().required()
  })
};

const getDepartments = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    sortType: Joi.string(),
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
