import httpStatus from 'http-status';
import AppMessage from '../../constants/message.constant';

/* Services */
import academicInfoService from './academicInfo.services';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import { Semester } from '@prisma/client';

import archiver from 'archiver';

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
        status: getAcademicStatus(semester.startDate, semester.endDate)
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

const downloadIdeaZipData = catchAsync(async (req, res) => {
  // Set response headers
  const zipFileName = 'Academic_Year_Ideas.zip';
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);

  // Create a zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Compression level
  });

  // Handle archive errors
  archive.on('error', (err) => {
    console.error('Error during archiving:', err);
    res.status(500).send(`Error during archiving: ${err}`);
  });

  archive.pipe(res);

  // Get the Excel stream
  const excelStream = await academicInfoService.createExcelStream(req.params.academicInfoId);

  // Append the Excel stream to the archive
  archive.append(excelStream, { name: 'ideas.xlsx' });

  // Finalize the archive
  archive.finalize();
});

export default {
  createAcademicInfo,
  getAcademicInfos,
  getAcademicInfo,
  updateAcademicInfo,
  deleteAcademicInfo,
  downloadIdeaZipData
};
