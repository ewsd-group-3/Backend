import httpStatus from 'http-status';
import { staffService } from '../services';
import AppMessage from '../../constants/message.constant';

/* Utils */
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import exclude from '../../utils/exclude';

const createStaff = catchAsync(async (req, res) => {
  const { email, name, password } = req.body;
  const staff = await staffService.createStaff(email, password, name);
  const staffWithoutPassword = exclude(staff, ['password', 'createdAt', 'updatedAt']);
  successResponse(res, httpStatus.CREATED, AppMessage.userCreated, {
    staff: staffWithoutPassword
  });
});

const getStaffs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await staffService.queryStaffs(filter, options);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, result);
});

const getStaff = catchAsync(async (req, res) => {
  const staff = await staffService.getStaffById(req.params.staffId);
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Staff not found');
  }
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, staff);
});

const updateStaff = catchAsync(async (req, res) => {
  const staff = await staffService.updateStaffById(req.params.staffId, req.body);
  successResponse(res, httpStatus.OK, AppMessage.userUpdate, { ...staff });
});

const deleteStaff = catchAsync(async (req, res) => {
  await staffService.deleteStaffById(req.params.staffId);
  successResponse(res, httpStatus.NO_CONTENT, AppMessage.deleted);
});

export default {
  createStaff,
  getStaffs,
  getStaff,
  updateStaff,
  deleteStaff
};
