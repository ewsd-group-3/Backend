import httpStatus from 'http-status';
import AppMessage from '../../constants/message.constant';

/* Services */
import academicInfoService from './academicInfo.services';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';

const createAcademicInfo = catchAsync(async (req, res) => {
  const { name } = req.body;
  const academicInfo = await academicInfoService.createAcademicInfo(name);
  successResponse(res, httpStatus.CREATED, AppMessage.academicInfoCreated, { academicInfo });
});

const getAcademicInfos = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await academicInfoService.queryAcademicInfos(filter, options);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, result);
});

const getAcademicInfo = catchAsync(async (req, res) => {
  const academicInfo = await academicInfoService.getAcademicInfoById(req.params.academicInfoId);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, academicInfo);
});

const updateAcademicInfo = catchAsync(async (req, res) => {
  const academicInfo = await academicInfoService.updateAcademicInfoById(
    req.params.academicInfoId,
    req.body
  );
  successResponse(res, httpStatus.OK, AppMessage.academicInfoUpdated, { ...academicInfo });
});

const deleteAcademicInfo = catchAsync(async (req, res) => {
  await academicInfoService.deleteAcademicInfoById(req.params.academicInfoId);
  successResponse(res, httpStatus.NO_CONTENT, AppMessage.staffDeleted);
});

export default {
  createAcademicInfo,
  getAcademicInfos,
  getAcademicInfo,
  updateAcademicInfo,
  deleteAcademicInfo
};
