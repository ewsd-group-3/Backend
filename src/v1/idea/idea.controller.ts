import httpStatus from 'http-status';
import ideaService from './idea.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import ApiError from '../../utils/apiError';
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import { IdeaDocument } from '@prisma/client';

const createIdea = catchAsync(async (req, res) => {
  const { title, description, authorId, semesterId, isAnonymous, categoryIds, documents } =
    req.body;

  // check categories valid
  const idea = await ideaService.createIdea(title, description, authorId, semesterId, isAnonymous);

  // Add Idea Categories
  const ideaCategories = await ideaService.addIdeaCategories(idea.id, categoryIds);

  // Add Idea Documents
  let ideaDocuments: IdeaDocument[] = [];

  documents.forEach(async (document: IdeaDocument) => {
    ideaDocuments.push(
      await ideaService.addIdeaDocument(
        document.name,
        document.documenttype,
        document.documentDownloadUrl,
        document.documentDeleteUrl,
        idea.id
      )
    );
  });

  successResponse(res, httpStatus.CREATED, AppMessage.ideaCreated, {
    idea,
    ideaCategories,
    ideaDocuments
  });
});

const getIdeas = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);
  const { page, limit, count, totalPages, ideas } = await ideaService.queryIdeas(filter, options);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    page,
    limit,
    count,
    totalPages,
    ideas
  });
});

const getIdea = catchAsync(async (req, res) => {
  const idea = await ideaService.getIdeaDetailById(req.params.ideaId);
  if (!idea) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Id is not found');
  }
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, idea);
});

const updateIdea = catchAsync(async (req, res) => {
  var { categoryIds, documents, title, description, isAnonymous } = req.body;

  await ideaService.deleteIdeaCategoriesByIdeaId(req.params.ideaId);
  await ideaService.deleteIdeaDocumentsByIdeaId(req.params.ideaId);

  const idea = await ideaService.updateIdeaById(req.params.ideaId, title, description, isAnonymous);

  await ideaService.addIdeaCategories(req.params.ideaId, categoryIds);

  documents.forEach(async (document: IdeaDocument) => {
    await ideaService.addIdeaDocument(
      document.name,
      document.documenttype,
      document.documentDownloadUrl,
      document.documentDeleteUrl,
      req.params.ideaId
    );
  });

  successResponse(res, httpStatus.OK, AppMessage.ideaUpdated, { ...idea });
});

const deleteIdea = catchAsync(async (req, res) => {
  await ideaService.deleteIdeaById(req.params.ideaId);
  successResponse(res, httpStatus.OK, AppMessage.ideaDeleted);
});

export default {
  createIdea,
  getIdeas,
  getIdea,
  updateIdea,
  deleteIdea
};
