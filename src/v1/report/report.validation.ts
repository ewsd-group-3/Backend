import Joi from 'joi';

const createReport = {
  body: Joi.object().keys({
    ideaId: Joi.number().required(),
    reason: Joi.string()
  })
};

const getReports = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    sortType: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getReport = {
  params: Joi.object().keys({
    reportId: Joi.number().integer()
  })
};

const updateReport = {
  params: Joi.object().keys({
    reportId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      reason: Joi.string()
    })
    .min(1)
};

const deleteReport = {
  params: Joi.object().keys({
    reportId: Joi.number().integer()
  })
};

const rejectReport = {
  params: Joi.object().keys({
    reportId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      approvedBy: Joi.number()
    })
    .min(1)
};

export default {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  rejectReport
};
