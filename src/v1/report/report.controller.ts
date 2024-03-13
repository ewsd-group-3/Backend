import httpStatus from 'http-status';
import reportService from './report.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';

const createReport = catchAsync(async (req, res) => {
  const { ideaId, reportById, reason } = req.body;
  const report = await reportService.createReport(ideaId, reportById, reason);
  successResponse(res, httpStatus.CREATED, AppMessage.reportCreated, { report });
});

const getReports = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);
  const result = await reportService.queryReports(filter, options);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    ...result
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

const approveReport = catchAsync(async (req, res) => {
  const { approvedById } = req.body;

  await reportService.approvedReportById(req.params.reportId, approvedById);
  successResponse(res, httpStatus.OK, AppMessage.reportApproved);
});

const rejectReport = catchAsync(async (req, res) => {
  const { approvedById } = req.body;

  await reportService.rejectedReportById(req.params.reportId, approvedById);
  successResponse(res, httpStatus.OK, AppMessage.reportRejected);
});

export default {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  approveReport,
  rejectReport
};
