import httpStatus from 'http-status';
import systemReportService from './systemReport.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import exclude from '../../utils/exclude';

const getSystemReport = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['semesterId', 'startDate', 'endDate', 'page', 'limit']);
  const data = await systemReportService.getSystemReport(filter);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, data);
});

export default {
  getSystemReport
};
