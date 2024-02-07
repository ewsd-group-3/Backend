import express from 'express';
import adminRoute from './admin/routes';
import staffRoute from './staff/routes';
// import config from '../../config/config';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/admins',
    route: adminRoute
  },
  {
    path: '/staff',
    route: staffRoute
  }
];

// const devRoutes = [
// routes available only in development mode
//   {
//     path: '/docs',
//     route: docsRoute
//   }
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

export default router;
