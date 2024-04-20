import httpStatus from 'http-status';
import announcementService from './announcement.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';
import pick from '../../utils/pick';
import exclude from '../../utils/exclude';

const createAnnouncement = catchAsync(async (req, res) => {
  const announcer = req.staff;
  const { announcerId, subject, content, type, staffIds } = req.body;
  const announcement = await announcementService.createAnnouncement(
    announcerId,
    subject,
    content,
    type,
    staffIds
  );
  successResponse(res, httpStatus.CREATED, AppMessage.announcementCreated, { announcement });
});

const getAnnouncements = catchAsync(async (req, res) => {
  const staff = req.staff;
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);
  const { page, limit, count, totalPages, announcements } =
    await announcementService.queryAnnouncements(filter, options, staff);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, {
    page,
    count,
    limit,
    totalPages,
    announcements
  });
});

const getAnnouncement = catchAsync(async (req, res) => {
  const announcement = await announcementService.getAnnouncementById(req.params.announcementId);
  successResponse(res, httpStatus.OK, AppMessage.retrievedSuccessful, { announcement });
});

const updateAnnouncement = catchAsync(async (req, res) => {
  const announcement = await announcementService.updateAnnouncementById(
    req.params.announcementId,
    req.body
  );
  successResponse(res, httpStatus.OK, AppMessage.announcementUpdated, { announcement });
});

/* Not Used */
const deleteAnnouncement = catchAsync(async (req, res) => {
  await announcementService.deleteAnnouncementById(req.params.announcementId);
  successResponse(res, httpStatus.OK, AppMessage.announcementDeleted);
});

export default {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
