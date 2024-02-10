import express from 'express';
import authRoute from './routes/auth.routes';
// import staffRoute from './staff/routes';
import docsRoute from './routes/docs.routes';
import config from '../config/config';

const router = express.Router();

const defaultRoutes = [authRoute];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
