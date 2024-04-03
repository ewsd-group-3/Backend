import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import systemReportValidation from './systemReport.validation';
import systemReportController from './systemReport.controller';

const router = express.Router();

router
  .route('/')
  .get(
    auth('ADMIN'),
    validate(systemReportValidation.getSystemReport),
    systemReportController.getSystemReport
  );

export default router;
