import httpStatus from 'http-status';
import ideaService from './idea.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import ApiError from '../../utils/apiError';
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import { Idea, IdeaDocument, Vote } from '@prisma/client';

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

  const additionalAttributes: any[] = [
    'totalViewCount',
    'voteResult',
    'totalComments',
    'totalLikes',
    'totalDisLikes'
  ];
  let additionalSortBy = null;

  if (options.sortBy && additionalAttributes.includes(options.sortBy)) {
    additionalSortBy = options.sortBy;
    options.sortBy = null;
  }

  const { page, limit, count, totalPages, ideas } = await ideaService.queryIdeas(filter, options);
  let response = {
    page,
    limit,
    count,
    totalPages,
    ideas: ideas.map((idea) => ({
      ...idea,
      ...calculateCount(idea)
    }))
  };

  if (additionalSortBy && additionalSortBy == 'totalViewCount') {
    response.ideas = response.ideas.sort((a, b) => {
      if (options.sortType == 'desc') {
        return b.totalViewCount.localeCompare(a.totalViewCount);
      } else {
        return a.totalViewCount.localeCompare(b.totalViewCount);
      }
    });
  } else if (additionalSortBy && additionalSortBy == 'voteResult') {
    response.ideas = response.ideas.sort((a, b) => {
      if (options.sortType == 'desc') {
        return b.voteResult.localeCompare(a.voteResult);
      } else {
        return a.voteResult.localeCompare(b.voteResult);
      }
    });
  } else if (additionalSortBy && additionalSortBy == 'totalComments') {
    response.ideas = response.ideas.sort((a, b) => {
      if (options.sortType == 'desc') {
        return b.totalComments.localeCompare(a.totalComments);
      } else {
        return a.totalComments.localeCompare(b.totalComments);
      }
    });
  } else if (additionalSortBy && additionalSortBy == 'totalLikes') {
    response.ideas = response.ideas.sort((a, b) => {
      if (options.sortType == 'desc') {
        return b.totalLikes.localeCompare(a.totalLikes);
      } else {
        return a.totalLikes.localeCompare(b.totalLikes);
      }
    });
  } else if (additionalSortBy && additionalSortBy == 'totalDisLikes') {
    response.ideas = response.ideas.sort((a, b) => {
      if (options.sortType == 'desc') {
        return b.totalDisLikes.localeCompare(a.totalDisLikes);
      } else {
        return a.totalDisLikes.localeCompare(b.totalDisLikes);
      }
    });
  }

  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, response);
});

const calculateCount = (idea: any) => {
  return {
    totalLikes: idea.votes?.filter((x: Vote) => x.isThumbUp).length,
    totalDisLikes: idea.votes?.filter((x: Vote) => !x.isThumbUp).length,
    voteResult: idea.votes?.reduce((acc: number, v: Vote) => acc + (v.isThumbUp ? 1 : -1), 0),
    totalComments: idea.comments.length,
    totalViewCount: idea.views.length
  };
};

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

const hideIdea = catchAsync(async (req, res) => {
  await ideaService.hideIdeaById(req.params.ideaId);
  successResponse(res, httpStatus.OK, AppMessage.ideaHidden);
});

export default {
  createIdea,
  getIdeas,
  getIdea,
  updateIdea,
  deleteIdea,
  hideIdea
};
