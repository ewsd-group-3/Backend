import httpStatus from 'http-status';
import statisticalReportService from './systemReport.routes';
import AppMessage from '../../constants/message.constant';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import exclude from '../../utils/exclude';

const getSystemReport = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['academicYearId', 'semesterId', 'startDate', 'endDate']);
  const data = await statisticalReportService.getSystemReport(filter);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, data);
});

export default {
  getSystemReport
};
