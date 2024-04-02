import { Idea, IdeaCategory, IdeaDocument, Prisma, View } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma';
import ApiError from '../../utils/apiError';

/**
 * Create a Idea
 * @param {Object} IdeaBody
 * @returns {Promise<Idea>}
 */
const createIdea = async (
  title: string,
  description: string,
  authorId: number,
  semesterId: number,
  isAnonymous: boolean
): Promise<Idea> => {
  console.log('desc before create: ', description);

  return prisma.idea.create({ data: { title, description, authorId, semesterId, isAnonymous } });
};

/**
 * Create a Idea
 * @param {Object} IdeaBody
 * @returns {Promise<Idea>}
 */
const addIdeaCategories = async (
  ideaId: number,
  categoryIds: number[]
): Promise<IdeaCategory[]> => {
  let ideaCategories: IdeaCategory[] = [];

  categoryIds.forEach(async (categoryId) => {
    ideaCategories.push(await prisma.ideaCategory.create({ data: { ideaId, categoryId } }));
  });

  return ideaCategories;
};

/**
 * Create a Idea
 * @param {Object} IdeaBody
 * @returns {Promise<Idea>}
 */
const addIdeaDocument = async (
  name: string,
  documenttype: string,
  documentDownloadUrl: string,
  documentDeleteUrl: string,
  ideaId: number
): Promise<IdeaDocument> => {
  var ideaDoc = prisma.ideaDocument.create({
    data: { name, documenttype, documentDownloadUrl, documentDeleteUrl, ideaId }
  });

  return ideaDoc;
};

/**
 * Query for Ideas
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryIdeas = async <Key extends keyof Idea>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
  // keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
): Promise<{
  page: number;
  limit: number;
  count: number;
  totalPages: number;
  ideas: Pick<Idea, Key>[];
}> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 5;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const count: number = await prisma.idea.count({ where: filter });
  const totalPages: number = Math.ceil(count / limit);

  const ideas = await prisma.idea.findMany({
    where: filter,
    // select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    include: {
      ideaCategories: {
        include: {
          category: true
        }
      },
      author: true,
      votes: true,
      comments: true,
      views: true
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });

  return { page, limit, count, totalPages, ideas: ideas as Pick<Idea, Key>[] };
};

/**
 * Get Idea by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Idea}
 */
const getIdeaById = async <Key extends keyof Idea>(id: number): Promise<Pick<Idea, Key>> => {
  const idea = await prisma.idea.findUnique({
    where: { id }
  });

  if (!idea) throw new ApiError(httpStatus.NOT_FOUND, 'Idea is not found');
  return idea;
};

/**
 * Get Idea by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Idea, Key>>}
 */
const getIdeaDetailById = async <Key extends keyof Idea>(id: number): Promise<Pick<Idea, Key>> => {
  const idea = prisma.idea.findUnique({
    where: { id },
    include: {
      ideaCategories: {
        include: {
          category: true
        }
      },
      author: {
        include: {
          department: true
        }
      },
      semester: true,
      comments: {
        include: {
          staff: {
            include: {
              department: true
            }
          }
        }
      },
      votes: true,
      views: true,
      ideaDocuments: true
    }
  });

  if (!idea) throw new ApiError(httpStatus.NOT_FOUND, 'Idea is not found');

  // To Update View Count - Require StaffId
  // await updateViewCount(staffId, 1);

  return idea as Promise<Pick<Idea, Key>>;
};

/**
 * Update Idea by id
 * @param {ObjectId} IdeaId
 * @param {Object} updateBody
 * @returns {Promise<Idea>}
 */
const updateIdeaById = async <Key extends keyof Idea>(
  ideaId: number,
  title: string,
  description: string,
  isAnonymous: boolean,
  keys: Key[] = ['id', 'title', 'description', 'isAnonymous'] as Key[]
): Promise<Pick<Idea, Key>> => {
  const idea = await getIdeaById(ideaId);
  const updatedIdea = await prisma.idea.update({
    where: { id: idea.id },
    data: {
      title,
      description,
      isAnonymous
    }
  });

  return updatedIdea as Pick<Idea, Key>;
};

/**
 * Delete Idea by id
 * @param {ObjectId} IdeaId
 * @returns {Promise<Idea>}
 */
const deleteIdeaById = async (IdeaId: number): Promise<Idea> => {
  const idea = await getIdeaById(IdeaId);

  console.log('My log - IdeaId: ', IdeaId, ' Idea: ', idea);

  await prisma.idea.update({
    where: { id: idea.id },
    data: {
      comments: {
        deleteMany: {}
      },
      ideaCategories: {
        deleteMany: {}
      },
      ideaDocuments: {
        deleteMany: {}
      },
      votes: {
        deleteMany: {}
      },
      views: {
        deleteMany: {}
      }
    }
  });

  await prisma.idea.delete({ where: { id: idea.id } });
  return idea;
};

/**
 * Delete Idea Categories by Idea id
 * @param {ObjectId} IdeaId
 * @returns {Promise<Idea>}
 */
const deleteIdeaCategoriesByIdeaId = async (IdeaId: number): Promise<Idea> => {
  const idea = await getIdeaById(IdeaId);

  await prisma.idea.update({
    where: { id: idea.id },
    data: {
      ideaCategories: {
        deleteMany: {}
      }
    }
  });

  return idea;
};
/**
 * Delete Idea Document by idea id
 * @param {ObjectId} IdeaId
 * @returns {Promise<Idea>}
 */
const deleteIdeaDocumentsByIdeaId = async (IdeaId: number): Promise<Idea> => {
  const idea = await getIdeaById(IdeaId);

  await prisma.idea.update({
    where: { id: idea.id },
    data: {
      ideaDocuments: {
        deleteMany: {}
      }
    }
  });

  return idea;
};

/**
 * Update View Count
 * @param {ObjectId} IdeaId
 * @param {ObjectId} StaffId
 * @returns {Promise<View>}
 */
const updateViewCount = async (IdeaId: number, StaffId: number): Promise<View> => {
  let view = await prisma.view.findFirst({
    where: { ideaId: IdeaId, staffId: StaffId }
  });

  if (!view) {
    view = await prisma.view.create({ data: { ideaId: IdeaId, staffId: StaffId } });
  }

  return view as View;
};

/**
 * Hide Idea by Report id
 * @param {ObjectId} reportId
 * @returns {Promise<Report>}
 */
const hideIdeaByReportId = async <Key extends keyof Idea>(
  reportId: number
): Promise<Pick<Idea, Key>> => {
  const report = await prisma.report.findFirst({
    where: { id: reportId }
  });

  if (!report) throw new ApiError(httpStatus.NOT_FOUND, 'Report is not found');

  const idea = await getIdeaById(report.ideaId);
  const updatedIdea = await prisma.idea.update({
    where: { id: idea.id },
    data: {
      isHidden: true
    }
  });
  return updatedIdea as Pick<Idea, Key>;
};

const unhideIdeaByReportId = async <Key extends keyof Idea>(
  reportId: number
): Promise<Pick<Idea, Key>> => {
  const report = await prisma.report.findFirst({
    where: { id: reportId }
  });

  if (!report) throw new ApiError(httpStatus.NOT_FOUND, 'Report is not found');

  const idea = await getIdeaById(report.ideaId);
  const updatedIdea = await prisma.idea.update({
    where: { id: idea.id },
    data: {
      isHidden: false
    }
  });
  return updatedIdea as Pick<Idea, Key>;
};

/**
 * Hide Idea by id
 * @param {ObjectId} ideaId
 * @returns {Promise<Report>}
 */
const hideIdeaById = async <Key extends keyof Idea>(ideaId: number): Promise<Pick<Idea, Key>> => {
  const idea = await getIdeaById(ideaId);

  if (!idea) throw new ApiError(httpStatus.NOT_FOUND, 'Idea is not found');

  const updatedIdea = await prisma.idea.update({
    where: { id: idea.id },
    data: {
      isHidden: true
    }
  });
  return updatedIdea as Pick<Idea, Key>;
};

const unhideIdeaById = async <Key extends keyof Idea>(ideaId: number): Promise<Pick<Idea, Key>> => {
  const idea = await getIdeaById(ideaId);

  if (!idea) throw new ApiError(httpStatus.NOT_FOUND, 'Idea is not found');

  const updatedIdea = await prisma.idea.update({
    where: { id: idea.id },
    data: {
      isHidden: false
    }
  });
  return updatedIdea as Pick<Idea, Key>;
};

const incrementViewCount = async (ideaId: number, staffId: number): Promise<boolean> => {
  console.log('enter incrementViewCount, ideaId: ', ideaId, ' staffId: ', staffId);

  console.log('all views: ', await prisma.view.findMany());

  const view = await prisma.view.findFirst({
    where: { ideaId, staffId }
  });

  if (!view) {
    await prisma.view.create({
      data: {
        ideaId,
        staffId
      }
    });

    console.log('view not exist and increase view count');

    return true;
  }

  console.log('view exist and not increase view count');

  return false;
};

export default {
  createIdea,
  addIdeaCategories,
  addIdeaDocument,
  queryIdeas,
  getIdeaById,
  getIdeaDetailById,
  updateIdeaById,
  deleteIdeaById,
  deleteIdeaCategoriesByIdeaId,
  deleteIdeaDocumentsByIdeaId,
  updateViewCount,
  hideIdeaByReportId,
  hideIdeaById,
  unhideIdeaByReportId,
  unhideIdeaById,
  incrementViewCount
};
