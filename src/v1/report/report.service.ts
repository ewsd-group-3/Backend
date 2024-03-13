import { Report, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma';
import ApiError from '../../utils/apiError';

/**
 * Create a Report
 * @param {Object} ReportBody
 * @returns {Promise<Report>}
 */
const createReport = async (
  ideaId: number,
  reportById: number,
  reason: string
): Promise<Report> => {
  return prisma.report.create({ data: { ideaId, reportById, reason } });
};

/**
 * Query for Reports
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReports = async <Key extends keyof Report>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
): Promise<{
  page: number;
  limit: number;
  count: number;
  totalPages: number;
  reports: Pick<Report, Key>[];
}> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const count: number = await prisma.report.count({ where: filter });

  const reports = await prisma.report.findMany({
    where: filter,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      idea: true,
      reportBy: true
    },
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });

  const totalPages: number = Math.ceil(count / limit);

  return {
    page,
    limit,
    count,
    totalPages,
    reports: reports as Pick<Report, Key>[]
  };
};

/**
 * Get Report by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Report, Key>>}
 */
const getReportById = async <Key extends keyof Report>(id: number): Promise<Pick<Report, Key>> => {
  const report = prisma.report.findUnique({ where: { id } });
  if (!report) throw new ApiError(httpStatus.NOT_FOUND, 'Report is not found');
  return report as Promise<Pick<Report, Key>>;
};

/**
 * Update Report by id
 * @param {ObjectId} ReportId
 * @param {Object} updateBody
 * @returns {Promise<Report>}
 */
const updateReportById = async <Key extends keyof Report>(
  reportId: number,
  updateBody: Prisma.ReportUpdateInput
): Promise<Pick<Report, Key>> => {
  const report = await getReportById(reportId);
  const updatedReport = await prisma.report.update({
    where: { id: report.id },
    data: updateBody
  });
  return updatedReport as Pick<Report, Key>;
};

/**
 * Delete Report by id
 * @param {ObjectId} ReportId
 * @returns {Promise<Report>}
 */
const deleteReportById = async (ReportId: number): Promise<Report> => {
  const report = await getReportById(ReportId);
  // TODO: Search in Idea Table if report is used or not
  await prisma.report.delete({ where: { id: report.id } });
  return report;
};

/**
 * Approved Report by id
 * @param {ObjectId} ReportId
 * @param {ObjectId} approvedById
 * @returns {Promise<Report>}
 */
const approvedReportById = async <Key extends keyof Report>(
  reportId: number,
  approvedById: number
): Promise<Pick<Report, Key>> => {
  const report = await getReportById(reportId);
  const updatedReport = await prisma.report.update({
    where: { id: report.id },
    data: {
      isApproved: true,
      approvedById,
      approvedAt: new Date()
    }
  });
  return updatedReport as Pick<Report, Key>;
};

// RejectReport

/**
 * Approved Report by id
 * @param {ObjectId} ReportId
 * @param {ObjectId} approvedById
 * @returns {Promise<Report>}
 */
const rejectedReportById = async <Key extends keyof Report>(
  reportId: number,
  approvedById: number
): Promise<Pick<Report, Key>> => {
  const report = await getReportById(reportId);
  const updatedReport = await prisma.report.update({
    where: { id: report.id },
    data: {
      isApproved: false,
      approvedById,
      approvedAt: new Date()
    }
  });
  return updatedReport as Pick<Report, Key>;
};

export default {
  createReport,
  queryReports,
  getReportById,
  updateReportById,
  deleteReportById,
  rejectedReportById,
  approvedReportById
};
