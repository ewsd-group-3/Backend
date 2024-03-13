import httpStatus from 'http-status';
import AppMessage from '../../constants/message.constant';

/* Services */
import departmentService from './department.services';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';

const createDepartment = catchAsync(async (req, res) => {
  const { name } = req.body;
  const department = await departmentService.createDepartment(name);
  successResponse(res, httpStatus.CREATED, AppMessage.departmentCreated, { department });
});

const getDepartments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortType', 'sortBy', 'limit', 'page']);
  const { page, limit, count, totalPages, departments } = await departmentService.queryDepartments(
    filter,
    options
  );
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    page,
    limit,
    count,
    totalPages,
    departments
  });
});

const getDepartment = catchAsync(async (req, res) => {
  const department = await departmentService.getDepartmentById(req.params.departmentId);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, { department });
});

const updateDepartment = catchAsync(async (req, res) => {
  const department = await departmentService.updateDepartmentById(
    req.params.departmentId,
    req.body
  );
  successResponse(res, httpStatus.OK, AppMessage.departmentUpdated, { department });
});

const deleteDepartment = catchAsync(async (req, res) => {
  await departmentService.deleteDepartmentById(req.params.departmentId);
  successResponse(res, httpStatus.OK, AppMessage.departmentDeleted);
});

export default {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment
};
