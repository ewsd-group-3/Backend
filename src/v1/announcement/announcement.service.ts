import { Announcement, AudienceType, Prisma, Staff, StaffAnnouncementStatus } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma';
import ApiError from '../../utils/apiError';
import emailService from '../auth/email.service';
import { AuthStaff } from '../../types/response';

/**
 * Create a announcement
 * @param {Object} announcementBody
 * @returns {Promise<Announcement>}
 */
const createAnnouncement = async (
  // announcer: AuthStaff,
  announcerId: number,
  subject: string,
  content: string,
  type: AudienceType,
  staffIds: number[]
): Promise<Announcement> => {
  const staff = await prisma.staff.findUnique({
    where: { id: announcerId }
  });

  let staffs: Staff[] = [];

  if (type === AudienceType.ALL && staff?.departmentId) {
    staffs = await prisma.staff.findMany({
      where: { departmentId: staff.departmentId }
    });
  } else {
    staffs = await prisma.staff.findMany({
      where: { id: { in: staffIds } }
    });
  }

  const announcement = await prisma.announcement.create({
    data: {
      announcerId: announcerId,
      subject,
      content,
      type
    }
  });

  await Promise.all(
    staffs.map(async (staff) => {
      // Send Email
      await emailService.sendEmail(staff.email, subject, content);

      await prisma.staffAnnouncement.create({
        data: {
          staffId: staff.id,
          departmentId: staff.departmentId,
          announcementId: announcement.id,
          status: StaffAnnouncementStatus.SUCCESS
        }
      });
    })
  );

  return announcement as Announcement;
};

/**
 * Query for announcements
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAnnouncements = async <Key extends keyof Announcement>(
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
  announcements: Pick<Announcement, Key>[];
}> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 5;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const count: number = await prisma.announcement.count({ where: filter });
  const totalPages: number = Math.ceil(count / limit);

  const announcements = await prisma.announcement.findMany({
    where: filter,
    include: {
      audiences: {
        select: {
          id: true,
          staffId: true,
          staff: true,
          department: true,
          departmentId: true,
          announcementId: true,
          createdAt: true,
          updatedAt: true
        }
      }
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });

  return {
    page,
    limit,
    count,
    totalPages,
    announcements: announcements as Pick<Announcement, Key>[]
  };
};

/**
 * Get announcement by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Announcement, Key> | null>}
 */
const getAnnouncementById = async <Key extends keyof Announcement>(
  id: number
): Promise<Pick<Announcement, Key>> => {
  const announcement = await prisma.announcement.findUnique({
    where: { id },
    include: {
      audiences: {
        select: {
          id: true,
          staffId: true,
          staff: true,
          department: true,
          departmentId: true,
          announcementId: true,
          createdAt: true,
          updatedAt: true
        }
      }
    }
  });
  if (!announcement) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Announcement is not found');
  }
  return announcement;
};

/**
 * Update announcement by id
 * @param {ObjectId} announcementId
 * @param {Object} updateBody
 * @returns {Promise<Announcement>}
 */
const updateAnnouncementById = async <Key extends keyof Announcement>(
  announcementId: number,
  updateBody: Prisma.AnnouncementUpdateInput
): Promise<Pick<Announcement, Key>> => {
  const announcement = await getAnnouncementById(announcementId);
  const updatedAnnouncement = await prisma.announcement.update({
    where: { id: announcement.id },
    data: updateBody,
    include: { audiences: {} }
  });
  return updatedAnnouncement as Pick<Announcement, Key>;
};

/**
 * Delete announcement by id
 * @param {ObjectId} announcementId
 * @returns {Promise<Announcement>}
 */
const deleteAnnouncementById = async (announcementId: number): Promise<Announcement> => {
  const announcement = await getAnnouncementById(announcementId);

  const staffAnnouncements = await prisma.staffAnnouncement.findMany({
    where: { announcementId: announcement.id }
  });

  staffAnnouncements.map(async (staffAnnouncement) => {
    await prisma.staffAnnouncement.delete({ where: { id: staffAnnouncement.id } });
  });

  await prisma.announcement.delete({ where: { id: announcement.id } });

  return announcement;
};

export default {
  createAnnouncement,
  queryAnnouncements,
  getAnnouncementById,
  updateAnnouncementById,
  deleteAnnouncementById
};
