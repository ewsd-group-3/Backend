import httpStatus from 'http-status';
import AppMessage from '../../constants/message.constant';

/* Services */
import academicInfoService from './academicInfo.services';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import { AcademicInfo, Semester } from '@prisma/client';

import archiver from 'archiver';
import ApiError from '../../utils/apiError';

const createAcademicInfo = catchAsync(async (req, res) => {
  const { name, startDate, endDate, semesters } = req.body;

  const academicInfoReq = {
    startDate,
    endDate
  } as AcademicInfo;

  checkValidAcademicDateAndSemestersDates(academicInfoReq, semesters);

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
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);

  const additionalAttributes: any[] = ['status'];
  let additionalSortBy = null;

  if (options.sortBy && additionalAttributes.includes(options.sortBy)) {
    additionalSortBy = options.sortBy;
    options.sortBy = null;
  }

  const { page, limit, count, totalPages, academicInfos } =
    await academicInfoService.queryAcademicInfos(filter, options);

  let response = {
    page,
    limit,
    count,
    totalPages,
    academicInfos: academicInfos.map((academicInfo: any) => ({
      ...academicInfo,
      semesters: academicInfo.semesters.map((semester: any) => ({
        ...semester,
        status: getAcademicStatus(semester.startDate, semester.finalClosureDate)
      })),
      status: getAcademicStatus(academicInfo.startDate, academicInfo.endDate)
    }))
  };

  if (additionalSortBy && additionalSortBy == 'status') {
    response.academicInfos = response.academicInfos.sort((a, b) => {
      if (options.sortType == 'desc') {
        return b.status.localeCompare(a.status);
      } else {
        return a.status.localeCompare(b.status);
      }
    });
  }

  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, response);
});

const getAllAcademicInfos = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);

  const { academicInfos } = await academicInfoService.queryAcademicInfos(filter, options);

  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, { academicInfos });
});

const getAllSemesters = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);

  const { semesters } = await academicInfoService.querySemesters(filter, options);

  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, { semesters });
});

const getCurrentAcademicInfo = catchAsync(async (req, res) => {
  const academicInfo = await academicInfoService.getCurrentAcademicInfo();
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    academicInfo
  });
});

const getCurrentSemester = catchAsync(async (req, res) => {
  const semester = await academicInfoService.getCurrentSemester();
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, { semester });
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
  const academicInfo = (await academicInfoService.getAcademicInfoWithSemesterById(
    req.params.academicInfoId
  )) as any;
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    ...academicInfo,
    semesters: academicInfo.semesters.map((semester: any) => ({
      ...semester,
      status: getAcademicStatus(semester.startDate, semester.finalClosureDate)
    })),
    status: getAcademicStatus(academicInfo.startDate, academicInfo.endDate)
  });
});

const updateAcademicInfo = catchAsync(async (req, res) => {
  const academicInfo = await academicInfoService.updateAcademicInfoById(req.params.academicInfoId, {
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    name: req.body.name
  });

  if (!academicInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Academic Info not found');
  }

  const { semesters } = req.body;

  checkValidAcademicDateAndSemestersDates(academicInfo, semesters);

  const updatedSemesters = await Promise.all(
    semesters.map(async (semester: Semester) => {
      return await academicInfoService.updateSemesterById(semester.id, semester);
    })
  );

  successResponse(res, httpStatus.OK, AppMessage.academicInfoUpdated, {
    ...academicInfo,
    semesters: updatedSemesters
  });
});

const checkValidAcademicDateAndSemestersDates = (
  academicInfo: AcademicInfo,
  semesters: Semester[]
) => {
  if (semesters.length != 2) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'There must be two semesters in Academic Year');
  }

  // check valid academic info
  if (!checkValidDateRange(academicInfo.startDate, academicInfo.endDate)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Academic Info dates are not valid');
  }

  // check valid semester date
  semesters?.forEach((semester: Semester) => {
    if (!checkValidDateRange(semester.startDate, semester.closureDate, semester.finalClosureDate)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Semester dates are not valid');
    }
    // check all semesters are in academic info
    if (academicInfo.startDate > semester.startDate) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Semester dates are not valid');
    }
    if (academicInfo.endDate < semester.finalClosureDate) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Semester dates are not valid');
    }
  });

  // check semester are not conflict
  var firstSemester = semesters[0];
  var secondSemester = semesters[1];
  if (
    !checkDateRangeOverlap(
      firstSemester.startDate,
      firstSemester.finalClosureDate,
      secondSemester.startDate,
      secondSemester.finalClosureDate
    )
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Semester dates are not valid');
  }

  return true;
};

const checkDateRangeOverlap = (
  startDate1: Date,
  endDate1: Date,
  startDate2: Date,
  endDate2: Date
) => {
  if (startDate1 > endDate1 || startDate2 > endDate2) {
    return false;
  }

  if (endDate1 >= startDate2 && startDate1 <= endDate2) {
    return false;
  }

  return true; // does not overlap
};

const checkValidDateRange = (firstDate: Date, secondDate: Date, thirdDate?: Date | null) => {
  if (firstDate > secondDate) {
    return false;
  }

  if (thirdDate) {
    if (secondDate > thirdDate) {
      return false;
    }
  }

  return true;
};

const deleteAcademicInfo = catchAsync(async (req, res) => {
  await academicInfoService.deleteAcademicInfoById(req.params.academicInfoId);
  successResponse(res, httpStatus.OK, AppMessage.academicInfoDeleted);
});

const downloadIdeaZipData = catchAsync(async (req, res) => {
  // Set response headers
  const zipFileName = 'Academic_Year_Ideas.zip';
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);

  // Create a zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  // Handle archive errors
  archive.on('error', (err) => {
    console.error('Error during archiving:', err);
    res.status(500).send(`Error during archiving: ${err}`);
  });

  archive.pipe(res);

  const academicInfo = await academicInfoService.getAcademicInfoById(
    Number(req.params.academicInfoId)
  );

  // Get the Excel stream
  const excelStream = await academicInfoService.createExcelStream(academicInfo);
  archive.append(excelStream, { name: 'ideas.xlsx' });

  // Get Idea Documents
  const data = await academicInfoService.getIdeaDocuments(academicInfo);
  if (data) {
    data.map((document: any) => {
      archive.append(document.documentReadable, {
        name: `/${document.directory}/` + document.fileName
      });
    });
  }

  // Finalize the archive
  archive.finalize();
});

export default {
  createAcademicInfo,
  getAcademicInfos,
  getAcademicInfo,
  getCurrentSemester,
  getCurrentAcademicInfo,
  getAllAcademicInfos,
  getAllSemesters,
  updateAcademicInfo,
  deleteAcademicInfo,
  downloadIdeaZipData
};
