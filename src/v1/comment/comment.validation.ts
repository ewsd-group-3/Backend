import Joi from 'joi';

const createComment = {
  body: Joi.object().keys({
    content: Joi.string().required(),
    staffId: Joi.number().integer().required(),
    ideaId: Joi.number().integer().required(),
    isAnonymous: Joi.boolean().required()
  })
};

const getComments = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    sortType: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getComment = {
  params: Joi.object().keys({
    commentId: Joi.number().integer()
  })
};

const updateComment = {
  params: Joi.object().keys({
    commentId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      content: Joi.string()
    })
    .min(1)
};

const deleteComment = {
  params: Joi.object().keys({
    commentId: Joi.number().integer()
  })
};

export default {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment
};
