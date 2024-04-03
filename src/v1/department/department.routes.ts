import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import departmentValidation from './department.validation';
import departmentController from './department.controller';

const router = express.Router();

router
  .route('/')
  .post(
    auth('ADMIN'),
    validate(departmentValidation.createDepartment),
    departmentController.createDepartment
  )
  .get(
    auth('ADMIN'),
    validate(departmentValidation.getDepartments),
    departmentController.getDepartments
  );

router
  .route('/:departmentId')
  .get(
    auth('ADMIN'),
    validate(departmentValidation.getDepartment),
    departmentController.getDepartment
  )
  .patch(
    auth('ADMIN'),
    validate(departmentValidation.updateDepartment),
    departmentController.updateDepartment
  )
  .delete(
    auth('ADMIN'),
    validate(departmentValidation.deleteDepartment),
    departmentController.deleteDepartment
  );

/* For All Departments Dropdown */
router
  .route('/')
  .get(
    auth('ADMIN', 'QA_MANAGER'),
    validate(departmentValidation.getDepartments),
    departmentController.getDepartments
  );

export default router;
