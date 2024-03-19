import Joi from 'joi';
import { AudienceType } from '@prisma/client';

const createAnnouncement = {
  body: Joi.object().keys({
    announcerId: Joi.number(), // Will Remove Later
    subject: Joi.string().required(),
    content: Joi.string().required(),
    type: Joi.string().required().valid(AudienceType.ALL, AudienceType.SPECIFIC),
    staffIds: Joi.array()
  })
};

const getAnnouncements = {
  query: Joi.object().keys({
    subject: Joi.string(),
    content: Joi.string(),
    type: Joi.string().valid(AudienceType.ALL, AudienceType.SPECIFIC),
    staffIds: Joi.array(),
    sortBy: Joi.string(),
    sortType: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getAnnouncement = {
  params: Joi.object().keys({
    announcementId: Joi.number().integer()
  })
};

const updateAnnouncement = {
  params: Joi.object().keys({
    announcementId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      subject: Joi.string(),
      content: Joi.string(),
      type: Joi.string().valid(AudienceType.ALL, AudienceType.SPECIFIC),
      staffIds: Joi.array()
    })
    .min(1)
};

const deleteAnnouncement = {
  params: Joi.object().keys({
    announcementId: Joi.number().integer()
  })
};

export default {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
