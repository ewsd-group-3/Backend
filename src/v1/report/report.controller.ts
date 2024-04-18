import httpStatus from 'http-status';
import reportService from './report.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';

const createReport = catchAsync(async (req, res) => {
  const staff = req.staff;
  const { ideaId, reason } = req.body;
  const report = await reportService.createReport(ideaId, staff.id, reason);
  successResponse(res, httpStatus.CREATED, AppMessage.reportCreated, { report });
});

const getReports = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);
  const result = (await reportService.queryReports(filter, options)) as any;
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    ...result,
    reports: result.reports?.map((report: any) => ({
      ...report,
      isStaffActive: report.idea.author.isActive,
      isIdeaHidden: report.idea.isHidden
    }))
  });
});

const getReport = catchAsync(async (req, res) => {
  const report = await reportService.getReportById(req.params.reportId);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, report);
});

const updateReport = catchAsync(async (req, res) => {
  const report = await reportService.updateReportById(req.params.reportId, req.body);
  successResponse(res, httpStatus.OK, AppMessage.reportUpdated, { ...report });
});

const deleteReport = catchAsync(async (req, res) => {
  await reportService.deleteReportById(req.params.reportId);
  successResponse(res, httpStatus.OK, AppMessage.reportDeleted);
});

const rejectReport = catchAsync(async (req, res) => {
  var staff = req.staff;

  await reportService.rejectedReportById(req.params.reportId, staff.id);
  successResponse(res, httpStatus.OK, AppMessage.reportRejected);
});

export default {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  rejectReport
};
