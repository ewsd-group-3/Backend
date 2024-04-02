import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import commentValidation from './comment.validation';
import commentController from './comment.controller';

const router = express.Router();

router
  .route('/')
  .post(auth('STAFF'), validate(commentValidation.createComment), commentController.createComment)
  .get(auth('STAFF'), validate(commentValidation.getComments), commentController.getComments);

router
  .route('/:commentId')
  .get(auth('STAFF'), validate(commentValidation.getComment), commentController.getComment)
  .patch(auth('STAFF'), validate(commentValidation.updateComment), commentController.updateComment)
  .delete(
    auth('STAFF'),
    validate(commentValidation.deleteComment),
    commentController.deleteComment
  );

export default router;
