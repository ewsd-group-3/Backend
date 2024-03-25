import prisma from '../../prisma';

/**
 * Query for statistical Report
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const getIdeaReport = async (filter: {
  academicYearId?: number;
  semesterId?: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  ideasCount: number;
  commentsCount: number;
  upVotesCount: number;
  downVotesCount: number;
  contributorsCount: number;
  anonymousCount: number;
  anonymousCmtCount: number;
  noCommentCount: number;
  categoryPercentage: object[];
  departmentPercentage: object[];
  contributorPercentage: object[];
}> => {
  const academicYearId = filter?.academicYearId;
  const semesterId = filter?.semesterId;
  const startDate = filter?.startDate;
  const endDate = filter?.endDate;

  const semesters = await prisma.semester.findMany({
    where: { academicInfoId: academicYearId }
  });
  const semesterIds = semesters.map((semester) => semester.id);

  const ideas = await prisma.idea.findMany({
    where: {
      ...(academicYearId && { semesterId: { in: semesterIds } }),
      ...(semesterId && { semesterId: semesterId }),
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

  const categoryPercentage = await getCategoryPercentage(ideaIds);
  const departmentPercentage = await getDepartmentPercentage(ideaIds);
  const contributorPercentage = await getContributorPercentage(ideaIds);

  return {
    ideasCount,
    commentsCount,
    upVotesCount,
    downVotesCount,
    contributorsCount,
    anonymousCount,
    anonymousCmtCount,
    noCommentCount,
    categoryPercentage,
    departmentPercentage,
    contributorPercentage
  };
};

/**
 * Query for statistical Report
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const getDepartmentReport = async (filter: {
  departmentId?: number;
  academicYearId?: number;
  semesterId?: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  ideasCount: number;
  commentsCount: number;
  upVotesCount: number;
  downVotesCount: number;
  contributorsCount: number;
  anonymousCount: number;
  anonymousCmtCount: number;
  noCommentCount: number;
  categoryPercentage: object[];
}> => {
  const departmentId = filter.departmentId;
  const academicYearId = filter?.academicYearId;
  const semesterId = filter?.semesterId;
  const startDate = filter?.startDate;
  const endDate = filter?.endDate;

  const authors = await prisma.staff.findMany({
    where: { departmentId }
  });
  const authorIds = authors.map((author) => author.id);

  const semesters = await prisma.semester.findMany({
    where: { academicInfoId: academicYearId }
  });
  const semesterIds = semesters.map((semester) => semester.id);

  const ideas = await prisma.idea.findMany({
    where: {
      ...(departmentId && { authorId: { in: authorIds } }),
      ...(academicYearId && { semesterId: { in: semesterIds } }),
      ...(semesterId && { semesterId: semesterId }),
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

  const categoryPercentage = await getCategoryPercentage(ideaIds);

  return {
    ideasCount,
    commentsCount,
    upVotesCount,
    downVotesCount,
    contributorsCount,
    anonymousCount,
    anonymousCmtCount,
    noCommentCount,
    categoryPercentage
  };
};

const getCategoryPercentage = async (ideaIds: number[]) => {
  const categories = await prisma.category.findMany();
  const ideaCategories = await prisma.ideaCategory.findMany({ where: { ideaId: { in: ideaIds } } });

  const categoryPercentage = categories.map((category) => {
    const categoryCount = ideaCategories.filter(
      (ideaCategory) => ideaCategory.categoryId === category.id
    ).length;
    const percentage = (categoryCount / ideaIds.length) * 100;
    return { category, percentage: percentage ? Number(percentage.toFixed(2)) : 0 };
  });

  return categoryPercentage;
};

const getDepartmentPercentage = async (ideaIds: number[]) => {
  const departments = await prisma.department.findMany();

  const departmentPercentage = await Promise.all(
    departments.map(async (department) => {
      const staffs = await prisma.staff.findMany({ where: { departmentId: department.id } });
      const staffIds = staffs.map((staff) => staff.id);

      const departmentIdeaCount = await prisma.idea.count({
        where: {
          authorId: { in: staffIds },
          id: { in: ideaIds }
        }
      });
      const percentage = ideaIds.length > 0 ? (departmentIdeaCount / ideaIds.length) * 100 : 0;
      return { department, percentage: Number(percentage.toFixed(2)) };
    })
  );

  return departmentPercentage;
};

const getContributorPercentage = async (ideaIds: number[]) => {
  const departments = await prisma.department.findMany();

  const contributorsPercentage = await Promise.all(
    departments.map(async (department) => {
      const staffs = await prisma.staff.findMany({ where: { departmentId: department.id } });
      const staffIds = staffs.map((staff) => staff.id);
      const staffCount = await prisma.staff.count({ where: { id: { in: staffIds } } });
      const staffIdeaCount = await prisma.staff.count({
        where: {
          id: { in: staffIds },
          ideas: { some: { id: { in: ideaIds } } }
        }
      });
      const percentage = staffCount > 0 ? (staffIdeaCount / staffCount) * 100 : 0;
      return { department, percentage: Number(percentage.toFixed(2)) };
    })
  );

  return contributorsPercentage;
};

export default {
  getIdeaReport,
  getDepartmentReport
};
