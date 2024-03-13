import httpStatus from 'http-status';
import AppMessage from '../../constants/message.constant';

/* Services */
import academicInfoService from './academicInfo.services';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import { Semester } from '@prisma/client';
import { stat } from 'fs';

const createAcademicInfo = catchAsync(async (req, res) => {
  const { name, startDate, endDate, semesters } = req.body;
  const academicInfo = await academicInfoService.createAcademicInfo(name, startDate, endDate);

  const semesterAry: Semester[] = [];

  semesters?.forEach(async (semester: Semester) => {
    let sem = await academicInfoService.createSemester(
      semester.name,
      semester.startDate,
      semester.closureDate,
      semester.finalClosureDate,
      academicInfo.id
    );

    semesterAry.push(sem);
  });

  successResponse(res, httpStatus.CREATED, AppMessage.academicInfoCreated, {
    academicInfo
  });
});

const getAcademicInfos = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { page, limit, count, totalPages, academicInfos } =
    await academicInfoService.queryAcademicInfos(filter, options);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    page,
    limit,
    count,
    totalPages,
    academicInfos: academicInfos.map((academicInfo) => ({
      ...academicInfo,
      status: getAcademicStatus(academicInfo.startDate, academicInfo.endDate)
    }))
  });
});

const getAcademicStatus = (startDate: Date, endDate: Date) => {
  const currentDate = new Date();
  if (currentDate < startDate) {
    return 'Upcoming';
  } else if (currentDate > endDate) {
    return 'Done';
  } else {
    return 'Ongoing';
  }
};

const getAcademicInfo = catchAsync(async (req, res) => {
  const academicInfo = await academicInfoService.getAcademicInfoWithSemesterById(
    req.params.academicInfoId
  );
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    ...academicInfo,
    status: getAcademicStatus(academicInfo.startDate, academicInfo.endDate)
  });
});

const updateAcademicInfo = catchAsync(async (req, res) => {
  const academicInfo = await academicInfoService.updateAcademicInfoById(
    req.params.academicInfoId,
    req.body
  );

  req.body.semesters?.forEach(async (semester: Semester) => {
    let sem = await academicInfoService.updateSemesterById(semester.id, semester);
  });

  successResponse(res, httpStatus.OK, AppMessage.academicInfoUpdated, { ...academicInfo });
});

const deleteAcademicInfo = catchAsync(async (req, res) => {
  await academicInfoService.deleteAcademicInfoById(req.params.academicInfoId);
  successResponse(res, httpStatus.OK, AppMessage.academicInfoDeleted);
});

export default {
  createAcademicInfo,
  getAcademicInfos,
  getAcademicInfo,
  updateAcademicInfo,
  deleteAcademicInfo
};
