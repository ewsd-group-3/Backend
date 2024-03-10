import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import announcementValidation from './announcement.validation';
import announcementController from './announcement.controller';

const router = express.Router();

router
  .route('/')
  .post(
    auth('QA_COORDINATOR'),
    validate(announcementValidation.createAnnouncement),
    announcementController.createAnnouncement
  )
  .get(
    auth('QA_COORDINATOR'),
    validate(announcementValidation.getAnnouncements),
    announcementController.getAnnouncements
  );

router
  .route('/:announcementId')
  .get(
    auth('QA_COORDINATOR'),
    validate(announcementValidation.getAnnouncement),
    announcementController.getAnnouncement
  )
  .patch(
    auth('QA_COORDINATOR'),
    validate(announcementValidation.updateAnnouncement),
    announcementController.updateAnnouncement
  )
  .delete(
    auth('QA_COORDINATOR'),
    validate(announcementValidation.deleteAnnouncement),
    announcementController.deleteAnnouncement
  );

export default router;
