import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import categoryValidation from './category.validation';
import categoryController from './category.controller';

const router = express.Router();

router
  .route('/')
  .post(
    // auth('QA_MANAGER'),
    validate(categoryValidation.createCategory),
    categoryController.createCategory
  )
  .get(auth('STAFF'), validate(categoryValidation.getCategories), categoryController.getCategories);

router
  .route('/:categoryId')
  .get(auth('STAFF'), validate(categoryValidation.getCategory), categoryController.getCategory)
  .patch(
    auth('QA_MANAGER'),
    validate(categoryValidation.updateCategory),
    categoryController.updateCategory
  )
  .delete(
    auth('QA_MANAGER'),
    validate(categoryValidation.deleteCategory),
    categoryController.deleteCategory
  );

export default router;
