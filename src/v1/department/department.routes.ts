import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import departmentValidation from './department.validation';
import departmentController from './department.controller';

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageDepartments'),
    validate(departmentValidation.createDepartment),
    departmentController.createDepartment
  )
  .get(
    auth('getDepartments'),
    validate(departmentValidation.getDepartments),
    departmentController.getDepartments
  );

router
  .route('/:departmentId')
  .get(
    auth('getDepartments'),
    validate(departmentValidation.getDepartment),
    departmentController.getDepartment
  )
  .patch(
    auth('manageDepartments'),
    validate(departmentValidation.updateDepartment),
    departmentController.updateDepartment
  )
  .delete(
    auth('manageDepartments'),
    validate(departmentValidation.deleteDepartment),
    departmentController.deleteDepartment
  );

export default router;
