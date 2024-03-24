import httpStatus from 'http-status';
import statisticalReportService from './statisticalReport.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import exclude from '../../utils/exclude';

const getIdeaReport = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['academicYearId', 'semesterId', 'startDate', 'endDate']);
  const data = await statisticalReportService.getIdeaReport(filter);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, data);
});

const getDepartmentReport = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'departmentId',
    'academicYearId',
    'semesterId',
    'startDate',
    'endDate'
  ]);
  const data = await statisticalReportService.getDepartmentReport(filter);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, data);
});

export default {
  getIdeaReport,
  getDepartmentReport
};
