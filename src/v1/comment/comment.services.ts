import { Comment, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma';
import ApiError from '../../utils/apiError';
import { config } from 'dotenv';

/**
 * Create a comment
 * @param {Object} commentBody
 * @returns {Promise<Comment>}
 */
const createComment = async (
  content: string,
  staffId: number,
  ideaId: number,
  isAnonymous: boolean
): Promise<Comment> => {
  return prisma.comment.create({ data: { content, staffId, ideaId, isAnonymous } });
};

/**
 * Query for comments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryComments = async <Key extends keyof Comment>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
): Promise<{ count: number; comments: Pick<Comment, Key>[] }> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 5;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const count: number = await prisma.comment.count({ where: filter });

  const comments = await prisma.comment.findMany({
    where: filter,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });

  return { count, comments: comments as Pick<Comment, Key>[] };
};

/**
 * Query for comments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
// const getAllCommentsByIdeaId = async <Key extends keyof Comment>(
//   filter: object,
//   options: {
//     limit?: number;
//     page?: number;
//     sortBy?: string;
//     sortType?: 'asc' | 'desc';
//   },
//   keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
// ): Promise<{ count: number; comments: Pick<Comment, Key>[] }> => {
//   const page = options.page ?? 1;
//   const limit = options.limit ?? 5;
//   const sortBy = options.sortBy;
//   const sortType = options.sortType ?? 'desc';

//   const count: number = await prisma.comment.count({ where: filter });

//   const comments = await prisma.comment.findMany({
//     where: filter,
//     select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
//     skip: (page - 1) * limit,
//     take: limit,
//     orderBy: sortBy ? { [sortBy]: sortType } : undefined
//   });

//   return { count, comments: comments as Pick<Comment, Key>[] };
// };

/**
 * Get comment by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Comment, Key> | null>}
 */
const getCommentById = async <Key extends keyof Comment>(
  id: number,
  keys: Key[] = [
    'id',
    'content',
    'isAnonymous',
    'staffId',
    'ideaId',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Comment, Key>> => {
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment is not found');
  }
  return comment as Promise<Pick<Comment, Key>>;
};

/**
 * Update comment by id
 * @param {ObjectId} commentId
 * @param {Object} updateBody
 * @returns {Promise<Comment>}
 */
const updateCommentById = async <Key extends keyof Comment>(
  commentId: number,
  updateBody: Prisma.CommentUpdateInput
): Promise<Pick<Comment, Key>> => {
  const comment = await getCommentById(commentId);
  const updatedComment = await prisma.comment.update({
    where: { id: comment.id },
    data: updateBody
  });
  return updatedComment as Pick<Comment, Key>;
};

/**
 * Delete comment by id
 * @param {ObjectId} commentId
 * @returns {Promise<Comment>}
 */
const deleteCommentById = async (commentId: number): Promise<Comment> => {
  const comment = await getCommentById(commentId);

  await prisma.comment.delete({ where: { id: comment.id } });
  return comment;
};

export default {
  createComment,
  queryComments,
  getCommentById,
  updateCommentById,
  deleteCommentById
};
