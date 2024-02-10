import httpStatus from 'http-status';
import pick from '../../utils/pick';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import { staffService } from '../services';

const createStaff = catchAsync(async (req, res) => {
  const { email, password, name, role } = req.body;
  const staff = await staffService.createStaff(email, password, name, role);
  res.status(httpStatus.CREATED).send(staff);
});

const getStaffs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await staffService.queryStaffs(filter, options);
  res.send(result);
});

const getStaff = catchAsync(async (req, res) => {
  const staff = await staffService.getStaffById(req.params.staffId);
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Staff not found');
  }
  res.send(staff);
});

const updateStaff = catchAsync(async (req, res) => {
  const staff = await staffService.updateStaffById(req.params.staffId, req.body);
  res.send(staff);
});

const deleteStaff = catchAsync(async (req, res) => {
  await staffService.deleteStaffById(req.params.staffId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createStaff,
  getStaffs,
  getStaff,
  updateStaff,
  deleteStaff
};
