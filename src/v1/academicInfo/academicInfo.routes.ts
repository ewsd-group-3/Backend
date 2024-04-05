import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import academicInfoValidation from './academicInfo.validation';
import academicInfoController from './academicInfo.controller';

const router = express.Router();

router.route('/currentSemester').get(academicInfoController.getCurrentSemester);
router.route('/currentAcademicInfo').get(academicInfoController.getCurrentAcademicInfo);

router
  .route('/')
  .post(
    auth('ADMIN'),
    validate(academicInfoValidation.createAcademicInfo),
    academicInfoController.createAcademicInfo
  )
  .get(
    auth('ADMIN', 'QA_MANAGER'),
    validate(academicInfoValidation.getAcademicInfos),
    academicInfoController.getAcademicInfos
  );

router.route('/all-academicInfos').get(academicInfoController.getAllAcademicInfos);

router.route('/all-semesters').get(academicInfoController.getAllSemesters);

router
  .route('/:academicInfoId')
  .get(
    auth('ADMIN', 'QA_MANAGER'),
    validate(academicInfoValidation.getAcademicInfo),
    academicInfoController.getAcademicInfo
  )
  .patch(
    auth('ADMIN'),
    validate(academicInfoValidation.updateAcademicInfo),
    academicInfoController.updateAcademicInfo
  )
  .delete(
    auth('ADMIN'),
    validate(academicInfoValidation.deleteAcademicInfo),
    academicInfoController.deleteAcademicInfo
  );

router
  .route('/download/:academicInfoId')
  .post(auth('QA_MANAGER'), academicInfoController.downloadIdeaZipData);

export default router;
