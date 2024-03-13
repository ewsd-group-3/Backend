import httpStatus from 'http-status';
import AppMessage from '../../constants/message.constant';

/* Services */
import voteService from './vote.services';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';

const giveVote = catchAsync(async (req, res) => {
  const { isThumbUp, staffId, ideaId } = req.body;
  const vote = await voteService.createOrUpdateVote(isThumbUp, staffId, ideaId);
  successResponse(res, httpStatus.OK, AppMessage.voteCreated, { vote });
});

const getVotes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortType', 'sortBy', 'limit', 'page']);
  const result = await voteService.queryVotes(filter, options);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, result);
});

const getVote = catchAsync(async (req, res) => {
  const vote = await voteService.getVoteById(req.params.voteId);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, { vote });
});

// const updateVote = catchAsync(async (req, res) => {
//   const vote = await voteService.updateVoteById(req.params.voteId, req.body);
//   successResponse(res, httpStatus.OK, AppMessage.voteUpdated, { vote });
// });

const deleteVote = catchAsync(async (req, res) => {
  await voteService.deleteVoteById(req.params.voteId);
  successResponse(res, httpStatus.NO_CONTENT, AppMessage.staffDeleted);
});

export default {
  giveVote,
  getVotes,
  getVote,
  // updateVote,
  deleteVote
};