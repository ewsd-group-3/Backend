import httpStatus from 'http-status';
import { Staff } from '@prisma/client';
import authService from './auth.service';
import tokenService from './token.service';
import emailService from './email.service';
import AppMessage from '../../constants/message.constant';

/* Utils */
import catchAsync from '../../utils/catchAsync';
import successResponse from '../../utils/successResponse';

const login = catchAsync(async (req, res) => {
  const { email, password, browserName } = req.body;
  const staff = await authService.loginStaffWithEmailAndPassword(email, password, browserName);
  const tokens = await tokenService.generateAuthTokens(staff);
  successResponse(res, httpStatus.OK, AppMessage.loggedIn, {
    staff,
    tokens
  });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  successResponse(res, httpStatus.OK, AppMessage.loggedOut);
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  successResponse(res, httpStatus.OK, 'Refreshed Tokens', { ...tokens });
});

const changePassword = catchAsync(async (req, res) => {
  const staff = req.user as Staff;

  successResponse(res, httpStatus.OK, 'Password Changed Successfully');
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  successResponse(res, httpStatus.OK, 'Password Reset Email Sent Successfully');
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token as string, req.body.password);
  successResponse(res, httpStatus.OK, 'Password Reset Successfully');
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const staff = req.user as Staff;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(staff);
  await emailService.sendVerificationEmail(staff.email, verifyEmailToken);
  successResponse(res, httpStatus.OK, 'Verification Sent to Email Successfully');
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token as string);
  successResponse(res, httpStatus.OK, 'Email Verified Successfully');
});

export default {
  login,
  logout,
  refreshTokens,
  changePassword,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
};
