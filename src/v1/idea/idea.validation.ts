import Joi from 'joi';

const createIdea = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    isAnonymous: Joi.boolean().required(),
    categoryIds: Joi.array().items(Joi.number().integer()).required(),
    documents: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        documenttype: Joi.string().required(),
        documentDownloadUrl: Joi.string().required(),
        documentDeleteUrl: Joi.string().required()
      })
    )
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
      title: Joi.string().required(),
      description: Joi.string().required(),
      isAnonymous: Joi.boolean().required()
    })
    .min(1)
};

const deleteIdea = {
  params: Joi.object().keys({
    ideaId: Joi.number().integer()
  })
};

const hideIdea = {
  params: Joi.object().keys({
    ideaId: Joi.number().integer()
  })
};

const hideIdeaByReportId = {
  params: Joi.object().keys({
    reportId: Joi.number().integer()
  })
};

export default {
  createIdea,
  getIdeas,
  getIdea,
  updateIdea,
  deleteIdea,
  hideIdea,
  hideIdeaByReportId
};
