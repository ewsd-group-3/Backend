import httpStatus from 'http-status';
import AppMessage from '../../constants/message.constant';

/* Services */
import voteService from './vote.services';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import ApiError from '../../utils/apiError';

const giveVote = catchAsync(async (req, res) => {
  const staff = req.staff ?? { id: 1 };

  const { voteStatus, ideaId }: { voteStatus: string; ideaId: number } = req.body;

  let vote = null;

  if (voteStatus.toLowerCase() == 'like') {
    vote = await voteService.createOrUpdateVote(true, staff.id, ideaId);
  } else if (voteStatus.toLowerCase() == 'dislike') {
    vote = await voteService.createOrUpdateVote(false, staff.id, ideaId);
  } else if (voteStatus.toLowerCase() == 'unlike' || voteStatus.toLowerCase() == 'undislike') {
    vote = await voteService.deleteVoteByStaffIdAndIdeaId(staff.id, ideaId);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid vote status');
  }

  successResponse(res, httpStatus.OK, `Staff ${staff.id} ${voteStatus} the idea`, { vote });
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
  successResponse(res, httpStatus.OK, AppMessage.voteDeleted);
});

export default {
  giveVote,
  getVotes,
  getVote,
  // updateVote,
  deleteVote
};
