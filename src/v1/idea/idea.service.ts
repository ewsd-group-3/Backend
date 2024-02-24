import { Idea, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma';
import ApiError from '../../utils/ApiError';

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
): Promise<{ count: number; ideas: Pick<Idea, Key>[] }> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const count: number = await prisma.idea.count({ where: filter });

  const ideas = await prisma.idea.findMany({
    where: filter,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });

  return { count, ideas: ideas as Pick<Idea, Key>[] };
};

/**
 * Get Idea by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Idea, Key>>}
 */
const getIdeaById = async <Key extends keyof Idea>(id: number): Promise<Pick<Idea, Key>> => {
  const idea = prisma.idea.findUnique({ where: { id } });
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
  queryIdeas,
  getIdeaById,
  updateIdeaById,
  deleteIdeaById
};
