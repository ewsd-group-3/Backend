import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import staffValidation from './staff.validation';
import staffController from './staff.controller';

const router = express.Router();

router
  .route('/')
  .post(auth('ADMIN'), validate(staffValidation.createStaff), staffController.createStaff)
  .get(
    auth('ADMIN', 'QA_COORDINATOR'),
    validate(staffValidation.getStaffs),
    staffController.getStaffs
  );

router
  .route('/upload-profile')
  .patch(auth('STAFF'), validate(staffValidation.uploadProfile), staffController.uploadProfile);

router
  .route('/change-password')
  .patch(auth('STAFF'), validate(staffValidation.changePassword), staffController.changePassword);

router
  .route('/:staffId')
  .get(auth('STAFF'), validate(staffValidation.getStaff), staffController.getStaff)
  .patch(auth('ADMIN'), validate(staffValidation.updateStaff), staffController.updateStaff);
// .delete(auth('manageStaffs'), validate(staffValidation.deleteStaff), staffController.deleteStaff);

router
  .route('/toggle-active/:staffId')
  .patch(auth('ADMIN', 'QA_MANAGER'), staffController.toggleActive);

router
  .route('/reset-password/:staffId')
  .patch(auth('ADMIN'), validate(staffValidation.resetPassword), staffController.resetPassword);

export default router;

/**
 * @swagger
 * tags:
 *   name: Staffs
 *   description: Staff management and retrieval
 */

/**
 * @swagger
 * /staffs:
 *   post:
 *     summary: Create a staff
 *     description: Only admin can create other staffs.
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               role:
 *                  type: string
 *                  enum: [staff, admin]
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *               role: staff
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Staff'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all staffs
 *     description: Only admins can retrieve all staffs.
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Staff name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Staff role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of staffs
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Staff'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /staffs/{id}:
 *   get:
 *     summary: Get a staff
 *     description: Logged in staffs can fetch only their own staff information. Only admins can fetch other staffs.
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Staff'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a staff
 *     description: Logged in staffs can only update their own information. Only admins can update other staffs.
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Staff'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a staff
 *     description: Logged in staffs can delete only themselves. Only admins can delete other staffs.
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
