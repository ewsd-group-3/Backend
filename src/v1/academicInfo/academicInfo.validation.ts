import Joi from 'joi';

const createAcademicInfo = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    semesters: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        startDate: Joi.date().required(),
        closureDate: Joi.date().required(),
        finalClosureDate: Joi.date().required()
      })
    )
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
      name: Joi.string(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      semesters: Joi.array().items(
        Joi.object().keys({
          id: Joi.number(),
          name: Joi.string(),
          startDate: Joi.date(),
          closureDate: Joi.date(),
          finalClosureDate: Joi.date()
        })
      )
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
