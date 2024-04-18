import httpStatus from 'http-status';
import ideaService from './idea.service';
import academicInfoService from './../academicInfo/academicInfo.services';
import staffService from '../staff/staff.service';
import emailService from '../auth/email.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import ApiError from '../../utils/apiError';
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import { Idea, IdeaDocument, Vote } from '@prisma/client';

const createIdea = catchAsync(async (req, res) => {
  const { title, description, isAnonymous, categoryIds, documents } = req.body;

  const author = req.staff ?? { id: 1 };

  // check semester valid
  const semester = await academicInfoService.getCurrentSemester();

  if (!semester) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'There is no active semester');
  }

  // check categories valid
  const idea = await ideaService.createIdea(
    title,
    description,
    author.id,
    semester.id,
    isAnonymous
  );

  // Add Idea Categories
  const ideaCategories = await ideaService.addIdeaCategories(idea.id, categoryIds);

  // Add Idea Documents
  let ideaDocuments: IdeaDocument[] = [];

  documents?.forEach(async (document: IdeaDocument) => {
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

  var qaCoordinator = await staffService.getQACoordinatorStaffByDepartmentId(author.departmentId);

  if (qaCoordinator?.email) {
    await emailService.sendEmailNewIdea(qaCoordinator?.email, 'New Idea', {
      idea,
      receiver: qaCoordinator
    });
  }

  successResponse(res, httpStatus.CREATED, AppMessage.ideaCreated, {
    idea,
    ideaCategories,
    ideaDocuments
  });
});

const getIdeas = catchAsync(async (req, res) => {
  const currentAcademicInfo = await academicInfoService.getCurrentAcademicInfo();
  const currentSemester = await academicInfoService.getCurrentSemester();

  const currentStaff = req.staff ?? { id: 1 };

  const filter = pick(req.query, ['title']);

  filter['semesterId'] = currentSemester.id;
  filter['isHidden'] = false;

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
      ...calculateCount(idea),
      likeStatus: getLikeStatus(idea, currentStaff.id)
    })),
    currentAcademicInfo,
    currentSemester
  };

  if (additionalSortBy && additionalSortBy == 'totalViewCount') {
    response.ideas = response.ideas.sort((a, b) => {
      if (options.sortType == 'desc') {
        return b.totalViewCount - a.totalViewCount;
      } else {
        return a.totalViewCount - b.totalViewCount;
      }
    });
  } else if (additionalSortBy && additionalSortBy == 'voteResult') {
    response.ideas = response.ideas.sort((a, b) => {
      if (options.sortType == 'desc') {
        return b.voteResult - a.voteResult;
      } else {
        return a.voteResult - b.voteResult;
      }
    });
  } else if (additionalSortBy && additionalSortBy == 'totalComments') {
    response.ideas = response.ideas.sort((a, b) => {
      if (options.sortType == 'desc') {
        return b.totalComments - a.totalComments;
      } else {
        return a.totalComments - b.totalComments;
      }
    });
  } else if (additionalSortBy && additionalSortBy == 'totalLikes') {
    response.ideas = response.ideas.sort((a, b) => {
      if (options.sortType == 'desc') {
        return b.totalLikes - a.totalLikes;
      } else {
        return a.totalLikes - b.totalLikes;
      }
    });
  } else if (additionalSortBy && additionalSortBy == 'totalDisLikes') {
    response.ideas = response.ideas.sort((a, b) => {
      if (options.sortType == 'desc') {
        return b.totalDisLikes - a.totalDisLikes;
      } else {
        return a.totalDisLikes - b.totalDisLikes;
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

const getLikeStatus = (idea: any, staffId: number): string => {
  const vote = idea.votes?.find((x: Vote) => x.staffId == staffId);
  if (vote) {
    return vote.isThumbUp ? 'like' : 'dislike';
  }
  return 'none';
};

const getIdea = catchAsync(async (req, res) => {
  const currentStaff = req.staff ?? { id: 1 };

  const idea = await ideaService.getIdeaDetailById(req.params.ideaId);
  if (!idea) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Id is not found');
  }

  await ideaService.incrementViewCount(req.params.ideaId, currentStaff.id);

  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    ...idea,
    ...calculateCount(idea),
    likeStatus: getLikeStatus(idea, currentStaff.id)
  });
});

const updateIdea = catchAsync(async (req, res) => {
  var { title, description, isAnonymous } = req.body;

  const idea = await ideaService.updateIdeaById(req.params.ideaId, title, description, isAnonymous);

  successResponse(res, httpStatus.OK, AppMessage.ideaUpdated, { ...idea });
});

const deleteIdea = catchAsync(async (req, res) => {
  await ideaService.deleteIdeaById(req.params.ideaId);
  successResponse(res, httpStatus.OK, AppMessage.ideaDeleted);
});

const hideIdea = catchAsync(async (req, res) => {
  var idea = await ideaService.hideIdeaById(req.params.ideaId);
  successResponse(res, httpStatus.OK, AppMessage.ideaHidden, { idea });
});

const unhideIdea = catchAsync(async (req, res) => {
  var idea = await ideaService.unhideIdeaById(req.params.ideaId);
  successResponse(res, httpStatus.OK, AppMessage.ideaUnhide, { idea });
});

const hideIdeaByReportId = catchAsync(async (req, res) => {
  const { reportId } = req.body;

  console.log('ReportId', reportId);

  var idea = await ideaService.hideIdeaByReportId(reportId);

  successResponse(res, httpStatus.OK, AppMessage.ideaHidden, { idea });
});

const unhideIdeaByReportId = catchAsync(async (req, res) => {
  const { reportId } = req.body;

  console.log('ReportId', reportId);

  var idea = await ideaService.hideIdeaByReportId(reportId);

  successResponse(res, httpStatus.OK, AppMessage.ideaUnhide, { idea });
});

export default {
  createIdea,
  getIdeas,
  getIdea,
  updateIdea,
  deleteIdea,
  hideIdea,
  hideIdeaByReportId,
  unhideIdea,
  unhideIdeaByReportId
};
