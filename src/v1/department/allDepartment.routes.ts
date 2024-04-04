import express from 'express';
import auth from '../../middleWares/auth';
import departmentController from './department.controller';

const router = express.Router();

/* For All Departments Dropdown */
router.route('/').get(departmentController.getAllDepartments);

export default router;
