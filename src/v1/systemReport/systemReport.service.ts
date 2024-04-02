import prisma from '../../prisma';
import { CategoryPercentage, DepartmentPercentage } from '../../types/response';

/**
 * Query for statistical Report
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const getSystemReport = async (filter: {
  semesterId?: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  topActiveUsers: Object;
  mostUsedBrowsers: Object;
  mostViewedIdeas: Object;
}> => {
  const semesterId = filter?.semesterId;
  const startDate = filter?.startDate;
  const endDate = filter?.endDate;

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
    },
    orderBy: sortBy ? { [sortBy]:  } : undefined,
  });
  const ideaIds = ideas.map((idea) => idea.id);

  const ideasCount = await prisma.idea.count({ where: { id: { in: ideaIds } } });
  const commentsCount = await prisma.comment.count({ where: { ideaId: { in: ideaIds } } });
  const upVotesCount = await prisma.vote.count({
    where: { ideaId: { in: ideaIds }, isThumbUp: true }
  });
  const downVotesCount = await prisma.vote.count({
    where: { ideaId: { in: ideaIds }, isThumbUp: false }
  });
  const contributorsCount = await prisma.staff.count({
    where: {
      ideas: {
        some: {
          id: {
            in: ideaIds
          }
        }
      }
    }
  });
  const anonymousCount = await prisma.idea.count({
    where: { id: { in: ideaIds }, isAnonymous: true }
  });
  const anonymousCmtCount = await prisma.comment.count({
    where: { ideaId: { in: ideaIds }, isAnonymous: true }
  });
  const noCommentCount = await prisma.idea.count({
    where: {
      id: { in: ideaIds },
      comments: { none: {} }
    }
  });

  return {
    topActiveUsers,
    mostUsedBrowsers,
    mostViewedIdeas
  };
};

export default {
  getSystemReport
};
