import Joi from 'joi';

const createAcademicInfo = {
  body: Joi.object().keys({
    name: Joi.string().required()
  })
};

const getAcademicInfos = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    sortType: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getAcademicInfo = {
  params: Joi.object().keys({
    academicInfoId: Joi.number().integer()
  })
};

const updateAcademicInfo = {
  params: Joi.object().keys({
    academicInfoId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      name: Joi.string()
    })
    .min(1)
};

const deleteAcademicInfo = {
  params: Joi.object().keys({
    academicInfoId: Joi.number().integer()
  })
};

export default {
  createAcademicInfo,
  getAcademicInfos,
  getAcademicInfo,
  updateAcademicInfo,
  deleteAcademicInfo
};
