import httpStatus from 'http-status';
import prisma from '../../prisma';
import { TokenType, Staff } from '@prisma/client';

import { AuthTokensResponse } from '../../types/response';
import staffService from '../staff/staff.service';
import tokenService from './token.service';

import ApiError from '../../utils/apiError';
import { encryptPassword, isPasswordMatch } from '../../utils/encryption';
import exclude from '../../utils/exclude';

/**
 * Login with staff name and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Omit<Staff, 'password'>>}
 */
const loginStaffWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<Omit<Staff, 'password'>> => {
  const staff = await staffService.getStaffByEmail(email, [
    'id',
    'email',
    'name',
    'password',
    'role',
    'isActive',
    'departmentId',
    'lastLoginDate',
    'createdAt',
    'updatedAt'
  ]);
  if (!staff || !(await isPasswordMatch(password, staff.password as string))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (!staff.isActive) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Account has been disabled!');
  }
  const updatedStaff = await prisma.staff.update({
    where: { id: staff.id },
    include: { department: true },
    data: { lastLoginDate: new Date() }
  });
  return exclude(updatedStaff, ['password']);
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenData = await prisma.token.findFirst({
    where: {
      token: refreshToken,
      type: TokenType.REFRESH,
      blacklisted: false
    }
  });
  if (!refreshTokenData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await prisma.token.delete({ where: { id: refreshTokenData.id } });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<AuthTokensResponse>}
 */
const refreshAuth = async (refreshToken: string): Promise<AuthTokensResponse> => {
  try {
    const refreshTokenData = await tokenService.verifyToken(refreshToken, TokenType.REFRESH);
    const { staffId } = refreshTokenData;

    const staff = await staffService.getStaffById(staffId);
    await prisma.token.delete({ where: { id: refreshTokenData.id } });
    return tokenService.generateAuthTokens({ id: staffId, departmentId: staff.departmentId });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenData = await tokenService.verifyToken(
      resetPasswordToken,
      TokenType.RESET_PASSWORD
    );

    const staff = await staffService.getStaffById(resetPasswordTokenData.staffId);
    if (!staff) {
      throw new Error();
    }
    const encryptedPassword = await encryptPassword(newPassword);
    await staffService.updateStaffById(staff.id, { password: encryptedPassword });
    await prisma.token.deleteMany({ where: { staffId: staff.id, type: TokenType.RESET_PASSWORD } });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<void>}
 */
const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  try {
    const verifyEmailTokenData = await tokenService.verifyToken(
      verifyEmailToken,
      TokenType.VERIFY_EMAIL
    );
    await prisma.token.deleteMany({
      where: { staffId: verifyEmailTokenData.staffId, type: TokenType.VERIFY_EMAIL }
    });
    // await staffService.updateStaffById(verifyEmailTokenData.staffId, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

export default {
  loginStaffWithEmailAndPassword,
  isPasswordMatch,
  encryptPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
};
