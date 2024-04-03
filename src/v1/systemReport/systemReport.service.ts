import prisma from '../../prisma';
import { TopActiveUsers } from '../../types/response';

/**
 * Query for statistical Report
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const getSystemReport = async (filter: {
  semesterId?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  page?: number;
}): Promise<{
  topActiveUsers: Object;
  mostUsedBrowsers: Object;
  mostViewedIdeas: Object;
}> => {
  const semesterId = filter?.semesterId;
  const startDate = filter?.startDate;
  const endDate = filter?.endDate;
  const page = filter?.page ?? 1;
  const limit = filter?.limit ?? 5;

  const ideas = await prisma.idea.findMany({
    where: {
      ...(semesterId && { semesterId }),
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        })
    }
  });
  const ideaIds = ideas.map((idea) => idea.id);
  const topActiveUsers = await getTopActiveUsers(ideaIds);

  const browsers = await prisma.loginHistory.groupBy({
    by: ['browserName'],
    _count: { browserName: true },
    orderBy: { _count: { browserName: 'desc' } },
    take: 3
  });

  const mostUsedBrowsers = browsers.map((browser) => ({
    ...browser,
    totalLogins: browser._count.browserName,
    _count: undefined
  }));

  const ideasWithViews = await prisma.idea.findMany({
    where: { id: { in: ideaIds } },
    include: { views: true, author: true }
  });

  const mostViewedIdeas = ideasWithViews
    .map((idea) => ({
      ...idea,
      viewsCount: idea.views.length
    }))
    .filter(Boolean)
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .slice((page - 1) * limit, page * limit);

  return {
    topActiveUsers,
    mostUsedBrowsers,
    mostViewedIdeas
  };
};

const getTopActiveUsers = async (ideaIds: number[]) => {
  const staffs = await prisma.staff.findMany({ where: { isActive: true } });

  const topActiveUsers = (await Promise.all(
    staffs.map(async (staff) => {
      const ideasCount = await prisma.idea.count({
        where: {
          authorId: staff.id,
          id: { in: ideaIds }
        }
      });

      const commentsCount = await prisma.comment.count({
        where: { staffId: staff.id, ideaId: { in: ideaIds } }
      });

      const votesCount = await prisma.vote.count({
        where: { staffId: staff.id, ideaId: { in: ideaIds } }
      });

      const viewsCount = await prisma.view.count({
        where: { staffId: staff.id, ideaId: { in: ideaIds } }
      });

      const total =
        Number(ideasCount) * 10 +
        Number(commentsCount * 4) +
        Number(votesCount * 3) +
        Number(viewsCount * 1);

      if (total > 0) {
        return { staff, ideasCount, commentsCount, votesCount, viewsCount, total };
      }
      return null;
    })
  )) as TopActiveUsers[];

  return topActiveUsers
    .filter(Boolean)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);
};

export default {
  getSystemReport
};
