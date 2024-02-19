import httpStatus from 'http-status';
import staffService from './staff.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import exclude from '../../utils/exclude';

const createStaff = catchAsync(async (req, res) => {
  const { email, name, departmentId, role } = req.body;
  const staff = await staffService.createStaff(email, name, departmentId, role);
  const staffWithoutPassword = exclude(staff, ['password', 'createdAt', 'updatedAt']);
  successResponse(res, httpStatus.CREATED, AppMessage.staffCreated, {
    staff: staffWithoutPassword
  });
});

const getStaffs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);
  const { count, staffs } = await staffService.queryStaffs(filter, options);
  const excludedStaffs = staffs.map((staff) =>
    exclude(staff, ['password', 'createdAt', 'updatedAt'])
  );
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    count,
    staffs: excludedStaffs
  });
});

const getStaff = catchAsync(async (req, res) => {
  const staff = await staffService.getStaffById(req.params.staffId);
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Staff not found');
  }
  const staffWithoutPassword = exclude(staff, ['password', 'createdAt', 'updatedAt']);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, staffWithoutPassword);
});

const updateStaff = catchAsync(async (req, res) => {
  const staff = await staffService.updateStaffById(req.params.staffId, req.body);
  successResponse(res, httpStatus.OK, AppMessage.staffUpdated, { ...staff });
});

const deleteStaff = catchAsync(async (req, res) => {
  await staffService.deleteStaffById(req.params.staffId);
  successResponse(res, httpStatus.NO_CONTENT, AppMessage.staffDeleted);
});

const toggleActive = catchAsync(async (req, res) => {
  const staff = await staffService.toggleActive(req.params.staffId);
  successResponse(
    res,
    httpStatus.OK,
    staff?.isActive ? AppMessage.statusOn : AppMessage.statusOff,
    { ...staff }
  );
});

const resetPassword = catchAsync(async (req, res) => {
  await staffService.resetPassword(req.params.staffId);
  successResponse(res, httpStatus.NO_CONTENT, 'Password Reset Successfully');
});

const changePassword = catchAsync(async (req, res) => {
  const staff = req.staff;
  const { oldPassword, newPassword } = req.body;
  await staffService.changePassword(staff?.id, oldPassword, newPassword);
  successResponse(res, httpStatus.OK, 'Password Reset Successfully');
});

export default {
  createStaff,
  getStaffs,
  getStaff,
  updateStaff,
  deleteStaff,
  toggleActive,
  resetPassword,
  changePassword
};
