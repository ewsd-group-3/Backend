import { Idea, IdeaCategory, IdeaDocument, Prisma } from '@prisma/client';
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
  const limit = options.limit ?? 10;
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
 * @returns {Promise<Pick<Idea, Key>>}
 */
const getIdeaById = async <Key extends keyof Idea>(id: number): Promise<Pick<Idea, Key>> => {
  const idea = prisma.idea.findUnique({
    where: { id }
  });

  if (!idea) throw new ApiError(httpStatus.NOT_FOUND, 'Idea is not found');
  return idea as Promise<Pick<Idea, Key>>;
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
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      semester: true,
      comments: true,
      votes: true,
      views: true,
      ideaDocuments: true
    }
  });

  if (!idea) throw new ApiError(httpStatus.NOT_FOUND, 'Idea is not found');
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
  updateBody: Prisma.IdeaUpdateInput,
  keys: Key[] = ['id', 'name'] as Key[]
): Promise<Pick<Idea, Key>> => {
  const idea = await getIdeaById(ideaId);
  const updatedIdea = await prisma.idea.update({
    where: { id: idea.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
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
  await prisma.idea.delete({ where: { id: idea.id } });
  return idea;
};

export default {
  createIdea,
  addIdeaCategories,
  addIdeaDocument,
  queryIdeas,
  getIdeaById,
  getIdeaDetailById,
  updateIdeaById,
  deleteIdeaById
};
