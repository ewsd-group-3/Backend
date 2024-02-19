import express from 'express';
import config from '../config/config';

/* Routes */
import authRoute from './auth/auth.routes';
import staffRoute from './staff/staff.routes';
import departmentRoute from './department/department.routes';
// import academicInfoRoute from './academicInfo/academicInfo.routes';
// import authRoute from './auth/auth.routes';
import docsRoute from './docs.routes';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/staffs',
    route: staffRoute
  },
  {
    path: '/departments',
    route: departmentRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  router.use('/docs', docsRoute);
}

export default router;
