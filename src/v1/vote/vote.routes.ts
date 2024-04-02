import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import voteValidation from './vote.validation';
import voteController from './vote.controller';

const router = express.Router();

router
  .route('/')
  .post(auth('STAFF'), validate(voteValidation.createVote), voteController.giveVote)
  .get(auth('STAFF'), validate(voteValidation.getVotes), voteController.getVotes);

router
  .route('/:voteId')
  .get(auth('STAFF'), validate(voteValidation.getVote), voteController.getVote)
  // .patch(auth('STAFF'), validate(voteValidation.updateVote), voteController.updateVote)
  .delete(auth('STAFF'), validate(voteValidation.deleteVote), voteController.deleteVote);

export default router;
