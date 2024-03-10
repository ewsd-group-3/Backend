import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from '../docs/swaggerDef';

const router = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: [
    'src/docs/*.yml',
    'src/v1/academicInfo/academicInfo.routes.ts',
    'src/v1/announcement/announcement.routes.ts',
    'src/v1/auth/auth.routes.ts',
    'src/v1/category/category.routes.ts',
    'src/v1/department/department.routes.ts',
    'src/v1/idea/idea.routes.ts',
    'src/v1/staff/staff.routes.ts'
  ]
});

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true
  })
);

export default router;
