import { Vote, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma';
import ApiError from '../../utils/apiError';

/**
 * Create a vote
 * @param {Object} voteBody
 * @returns {Promise<Vote>}
 */
const createOrUpdateVote = async (
  isThumbUp: boolean,
  staffId: number,
  ideaId: number
): Promise<Vote> => {
  var vote = await getVoteByStaffIdAndIdeaId(staffId, ideaId);

  if (vote) {
    return await updateVoteById(vote.id, isThumbUp);
  } else {
    return prisma.vote.create({ data: { staffId, ideaId, isThumbUp } });
  }
};

/**
 * Query for votes
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryVotes = async <Key extends keyof Vote>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
): Promise<{ count: number; votes: Pick<Vote, Key>[] }> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const count: number = await prisma.vote.count({ where: filter });

  const votes = await prisma.vote.findMany({
    where: filter,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });

  return { count, votes: votes as Pick<Vote, Key>[] };
};

/**
 * Get vote by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Vote, Key> | null>}
 */
const getVoteById = async <Key extends keyof Vote>(id: number): Promise<Pick<Vote, Key>> => {
  const vote = await prisma.vote.findUnique({
    where: { id }
  });
  if (!vote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vote is not found');
  }
  return vote;
};

/**
 * Check is Already Vote
 * @param {number} StaffId
 * @param {number} IdeaId
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Vote, Key> | null>}
 */
const getVoteByStaffIdAndIdeaId = async <Key extends keyof Vote>(
  StaffId: number,
  IdeaId: number
): Promise<Pick<Vote, Key> | null> => {
  return prisma.vote.findFirst({
    where: { staffId: StaffId, ideaId: IdeaId }
  }) as Promise<Pick<Vote, Key> | null>;
};

/**
 * Update vote by id
 * @param {ObjectId} voteId
 * @param {boolean} isThumbUp
 * @returns {Promise<Vote>}
 */
const updateVoteById = async <Key extends keyof Vote>(
  voteId: number,
  isThumbUp: boolean
): Promise<Pick<Vote, Key>> => {
  const vote = await getVoteById(voteId);

  const updatedVote = await prisma.vote.update({
    where: { id: vote.id },
    data: {
      isThumbUp,
      updatedAt: new Date()
    }
  });
  return updatedVote as Pick<Vote, Key>;
};

/**
 * Delete vote by id
 * @param {ObjectId} voteId
 * @returns {Promise<Vote>}
 */
const deleteVoteById = async (voteId: number): Promise<Vote> => {
  const vote = await getVoteById(voteId);
  await prisma.vote.delete({ where: { id: vote.id } });
  return vote;
};

export default {
  createOrUpdateVote,
  queryVotes,
  getVoteById,
  getVoteByStaffIdAndIdeaId,
  updateVoteById,
  deleteVoteById
};
