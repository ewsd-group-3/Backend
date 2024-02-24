import Joi from 'joi';

const createIdea = {
  body: Joi.object().keys({
    name: Joi.string().required()
  })
};

const getIdeas = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    sortType: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getIdea = {
  params: Joi.object().keys({
    ideaId: Joi.number().integer()
  })
};

const updateIdea = {
  params: Joi.object().keys({
    ideaId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      name: Joi.string()
    })
    .min(1)
};

const deleteIdea = {
  params: Joi.object().keys({
    ideaId: Joi.number().integer()
  })
};

export default {
  createIdea,
  getIdeas,
  getIdea,
  updateIdea,
  deleteIdea
};
