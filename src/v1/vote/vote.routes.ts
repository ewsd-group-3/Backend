import express from 'express';
import auth from '../../middleWares/auth';
import validate from '../../middleWares/validate';
import voteValidation from './vote.validation';
import voteController from './vote.controller';

const router = express.Router();

router
  .route('/')
  .post(
    // auth('ADMIN'),
    validate(voteValidation.createVote),
    voteController.giveVote
  )
  .get(
    // auth('ADMIN'),
    validate(voteValidation.getVotes),
    voteController.getVotes
  );

router
  .route('/:voteId')
  .get(auth('ADMIN'), validate(voteValidation.getVote), voteController.getVote)
  // .patch(auth('ADMIN'), validate(voteValidation.updateVote), voteController.updateVote)
  .delete(
    // auth('ADMIN'),
    validate(voteValidation.deleteVote),
    voteController.deleteVote
  );

export default router;
