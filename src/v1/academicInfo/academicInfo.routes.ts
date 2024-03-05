import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import academicInfoValidation from './academicInfo.validation';
import academicInfoController from './academicInfo.controller';

const router = express.Router();

router
  .route('/')
  .post(
    // auth('ADMIN'),
    validate(academicInfoValidation.createAcademicInfo),
    academicInfoController.createAcademicInfo
  )
  .get(
    // auth('ADMIN'),
    validate(academicInfoValidation.getAcademicInfos),
    academicInfoController.getAcademicInfos
  );

router
  .route('/:academicInfoId')
  .get(
    // auth('ADMIN'),
    validate(academicInfoValidation.getAcademicInfo),
    academicInfoController.getAcademicInfo
  )
  .patch(
    // auth('ADMIN'),
    validate(academicInfoValidation.updateAcademicInfo),
    academicInfoController.updateAcademicInfo
  )
  .delete(
    // auth('ADMIN'),
    validate(academicInfoValidation.deleteAcademicInfo),
    academicInfoController.deleteAcademicInfo
  );

export default router;
