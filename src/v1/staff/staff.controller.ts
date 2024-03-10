import httpStatus from 'http-status';
import staffService from './staff.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import exclude from '../../utils/exclude';

const createStaff = catchAsync(async (req, res) => {
  const { email, name, departmentId, role } = req.body;
  const staff = await staffService.createStaff(email, name, departmentId, role);
  const staffWithoutPassword = exclude(staff, ['password']);
  successResponse(res, httpStatus.CREATED, AppMessage.staffCreated, {
    staff: staffWithoutPassword
  });
});

const getStaffs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);
  const { page, limit, count, totalPages, staffs } = await staffService.queryStaffs(
    filter,
    options
  );
  const excludedStaffs = staffs.map((staff) => exclude(staff, ['password']));
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    page,
    count,
    limit,
    totalPages,
    staffs: excludedStaffs
  });
});

const getStaff = catchAsync(async (req, res) => {
  const staff = await staffService.getStaffById(req.params.staffId);
  const staffWithoutPassword = exclude(staff, ['password']);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    staff: staffWithoutPassword
  });
});

const updateStaff = catchAsync(async (req, res) => {
  const staff = await staffService.updateStaffById(req.params.staffId, req.body);
  const staffWithoutPassword = exclude(staff, ['password']);
  successResponse(res, httpStatus.OK, AppMessage.staffUpdated, {
    staff: staffWithoutPassword
  });
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
  successResponse(res, httpStatus.OK, 'Password Reset Successfully');
});

const changePassword = catchAsync(async (req, res) => {
  const staff = req.staff;
  const { oldPassword, newPassword } = req.body;
  await staffService.changePassword(staff?.id, oldPassword, newPassword);
  successResponse(res, httpStatus.OK, 'Password is Changed Successfully');
});

/* Not Used */
const deleteStaff = catchAsync(async (req, res) => {
  await staffService.deleteStaffById(req.params.staffId);
  successResponse(res, httpStatus.OK, AppMessage.staffDeleted);
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
