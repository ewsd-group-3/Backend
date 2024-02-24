import Joi from 'joi';

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required()
  })
};

const getCategories = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    sortType: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.number().integer()
  })
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      name: Joi.string()
    })
    .min(1)
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.number().integer()
  })
};

export default {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
};
