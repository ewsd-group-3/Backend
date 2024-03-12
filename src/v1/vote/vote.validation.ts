import Joi from 'joi';

const createVote = {
  body: Joi.object().keys({
    isThumbUp: Joi.boolean().required(),
    staffId: Joi.number().integer().required(),
    ideaId: Joi.number().integer().required()
  })
};

const getVotes = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    sortType: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getVote = {
  params: Joi.object().keys({
    voteId: Joi.number().integer()
  })
};

const updateVote = {
  params: Joi.object().keys({
    voteId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      isThumbUp: Joi.boolean().required(),
      staffId: Joi.number().integer().required(),
      ideaId: Joi.number().integer().required()
    })
    .min(1)
};

const deleteVote = {
  params: Joi.object().keys({
    voteId: Joi.number().integer()
  })
};

export default {
  createVote,
  getVotes,
  getVote,
  updateVote,
  deleteVote
};
