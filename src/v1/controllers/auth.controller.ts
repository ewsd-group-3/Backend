import httpStatus from 'http-status';
import { Staff } from '@prisma/client';
import { authService, staffService, tokenService, emailService } from '../services';
import AppMessage from '../../constants/message.constant';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import exclude from '../../utils/exclude';
import successResponse from '../../utils/successResponse';

const register = catchAsync(async (req, res) => {
  const { email, name, password } = req.body;
  const staff = await staffService.createStaff(email, password, name);
  const staffWithoutPassword = exclude(staff, ['password', 'createdAt', 'updatedAt']);
  const tokens = await tokenService.generateAuthTokens(staff);
  successResponse(res, httpStatus.CREATED, AppMessage.userCreated, {
    staff: staffWithoutPassword,
    tokens
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const staff = await authService.loginStaffWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(staff);
  successResponse(res, httpStatus.OK, AppMessage.loggedIn, {
    staff,
    tokens
  });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  successResponse(res, httpStatus.NO_CONTENT, AppMessage.loggedOut);
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  successResponse(res, httpStatus.OK, ['Refreshed Tokens'], { ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  successResponse(res, httpStatus.NO_CONTENT, ['Password Reset Email Sent Successfully']);
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token as string, req.body.password);
  successResponse(res, httpStatus.NO_CONTENT, ['Password Reset Successfully']);
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const staff = req.user as Staff;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(staff);
  await emailService.sendVerificationEmail(staff.email, verifyEmailToken);
  successResponse(res, httpStatus.NO_CONTENT, ['Verification Sent to Email Successfully']);
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token as string);
  successResponse(res, httpStatus.NO_CONTENT, ['Email Verified Successfully']);
});

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
};
