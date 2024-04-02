import Joi from 'joi';

const getIdeaReport = {
  query: Joi.object().keys({
    academicYearId: Joi.number(),
    semesterId: Joi.number(),
    startDate: Joi.date(),
    endDate: Joi.date()
  })
};

const getDepartmentReport = {
  query: Joi.object().keys({
    departmentId: Joi.number().required(),
    academicYearId: Joi.number(),
    semesterId: Joi.number(),
    startDate: Joi.date(),
    endDate: Joi.date()
  })
};

export default { getIdeaReport, getDepartmentReport };
