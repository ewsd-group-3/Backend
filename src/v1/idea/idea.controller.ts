import httpStatus from 'http-status';
import ideaService from './idea.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';

const createIdea = catchAsync(async (req, res) => {
  const { title, description, authorId, semesterId, isAnonymous } = req.body;
  const idea = await ideaService.createIdea(title, description, authorId, semesterId, isAnonymous);
  successResponse(res, httpStatus.CREATED, AppMessage.ideaCreated, { idea });
});

const getIdeas = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);
  const { count, ideas } = await ideaService.queryIdeas(filter, options);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    count,
    ideas
  });
});

const getIdea = catchAsync(async (req, res) => {
  const idea = await ideaService.getIdeaById(req.params.ideaId);
  if (!idea) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ide is not found');
  }
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, idea);
});

const updateIdea = catchAsync(async (req, res) => {
  const idea = await ideaService.updateIdeaById(req.params.ideaId, req.body);
  successResponse(res, httpStatus.OK, AppMessage.ideaUpdated, { ...idea });
});

const deleteIdea = catchAsync(async (req, res) => {
  await ideaService.deleteIdeaById(req.params.staffId);
  successResponse(res, httpStatus.NO_CONTENT, AppMessage.ideaDeleted);
});

export default {
  createIdea,
  getIdeas,
  getIdea,
  updateIdea,
  deleteIdea
};
