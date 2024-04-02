import httpStatus from 'http-status';
import AppMessage from '../../constants/message.constant';

/* Services */
import commentService from './comment.services';
import emailService from './../auth/email.service';
import staffService from '../staff/staff.service';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';

const createComment = catchAsync(async (req, res) => {
  const staff = req.staff ?? { id: 1 };

  const { content, ideaId, isAnonymous } = req.body;

  const comment = await commentService.createComment(content, staff.id, ideaId, isAnonymous);

  // var qaCoordinator = await staffService.getQACoordinatorStaffByDepartmentId(staff.departmentId);
  var commentBy = await staffService.getStaffById(staff.id);

  if (commentBy?.email) {
    await emailService.sendEmail(
      commentBy?.email,
      'New Comment',
      'A new comment has been added to your idea'
    );
  }

  successResponse(res, httpStatus.CREATED, AppMessage.commentCreated, { comment });
});

const getComments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortType', 'sortBy', 'limit', 'page']);
  const result = await commentService.queryComments(filter, options);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, result);
});

const getComment = catchAsync(async (req, res) => {
  const comment = await commentService.getCommentById(req.params.commentId);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, { comment });
});

const updateComment = catchAsync(async (req, res) => {
  const comment = await commentService.updateCommentById(req.params.commentId, req.body);
  successResponse(res, httpStatus.OK, AppMessage.commentUpdated, { comment });
});

const deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteCommentById(req.params.commentId);
  successResponse(res, httpStatus.OK, AppMessage.commentDeleted);
});

export default {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment
};
