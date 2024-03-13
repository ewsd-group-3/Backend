import express from 'express';
import config from '../config/config';

/* Routes */
import authRoute from './auth/auth.routes';
import staffRoute from './staff/staff.routes';
import departmentRoute from './department/department.routes';
import ideaRoute from './idea/idea.routes';
import categoryRoute from './category/category.routes';
import academicRoute from './academicInfo/academicInfo.routes';
import announcementRoute from './announcement/announcement.routes';
import commentRoute from './comment/comment.routes';
import voteRoute from './vote/vote.routes';
import reportRoute from './report/report.routes';
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
  },
  {
    path: '/ideas',
    route: ideaRoute
  },
  {
    path: '/categories',
    route: categoryRoute
  },
  {
    path: '/academicInfos',
    route: academicRoute
  },
  {
    path: '/announcements',
    route: announcementRoute
  },
  {
    path: '/comments',
    route: commentRoute
  },
  {
    path: '/votes',
    route: voteRoute
  },
  {
    path: '/reports',
    route: reportRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  router.use('/docs', docsRoute);
}

export default router;
