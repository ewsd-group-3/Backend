import Joi from 'joi';

const getSystemReport = {
  query: Joi.object().keys({
    semesterId: Joi.number(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    page: Joi.number(),
    limit: Joi.number()
  })
};

export default { getSystemReport };
