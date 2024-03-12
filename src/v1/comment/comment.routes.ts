import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import commentValidation from './comment.validation';
import commentController from './comment.controller';

const router = express.Router();

router
  .route('/')
  .post(
    // auth('ADMIN'),
    validate(commentValidation.createComment),
    commentController.createComment
  )
  .get(
    // auth('ADMIN'),
    validate(commentValidation.getComments),
    commentController.getComments
  );

router
  .route('/:commentId')
  .get(
    // auth('ADMIN'),
    validate(commentValidation.getComment),
    commentController.getComment
  )
  .patch(
    // auth('ADMIN'),
    validate(commentValidation.updateComment),
    commentController.updateComment
  )
  .delete(
    // auth('ADMIN'),
    validate(commentValidation.deleteComment),
    commentController.deleteComment
  );

export default router;
