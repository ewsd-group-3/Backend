import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import statisticalReportValidation from './statisticalReport.validation';
import statisticalReportController from './statisticalReport.controller';

const router = express.Router();

router.route('/ideas').get(
  // auth('QA_MANAGER', 'QA_COORDINATOR'),
  validate(statisticalReportValidation.getIdeaReport),
  statisticalReportController.getIdeaReport
);

router.route('/departments').get(
  // auth('QA_MANAGER', 'QA_COORDINATOR'),
  validate(statisticalReportValidation.getDepartmentReport),
  statisticalReportController.getDepartmentReport
);

export default router;
