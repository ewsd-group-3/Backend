import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import reportValidation from './report.validation';
import reportController from './report.controller';

const router = express.Router();

router
  .route('/')
  .post(auth('STAFF'), validate(reportValidation.createReport), reportController.createReport)
  .get(auth('STAFF'), validate(reportValidation.getReports), reportController.getReports);

router
  .route('/:reportId')
  .get(auth('STAFF'), validate(reportValidation.getReport), reportController.getReport)
  .patch(auth('QA_MANAGER'), validate(reportValidation.updateReport), reportController.updateReport)
  .delete(
    auth('QA_MANAGER'),
    validate(reportValidation.deleteReport),
    reportController.deleteReport
  );

router
  .route('/:reportId/reject')
  .patch(
    auth('QA_MANAGER'),
    validate(reportValidation.rejectReport),
    reportController.rejectReport
  );

export default router;
