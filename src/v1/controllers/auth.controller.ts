import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { authService, staffService, tokenService, emailService } from '../services';
import exclude from '../../utils/exclude';
import { Staff } from '@prisma/client';

const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const staff = await staffService.createStaff(email, password);
  const staffWithoutPassword = exclude(staff, ['password', 'createdAt', 'updatedAt']);
  const tokens = await tokenService.generateAuthTokens(staff);
  res.status(httpStatus.CREATED).send({ staff: staffWithoutPassword, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const staff = await authService.loginStaffWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(staff);
  res.send({ staff, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token as string, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const staff = req.user as Staff;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(staff);
  await emailService.sendVerificationEmail(staff.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token as string);
  res.status(httpStatus.NO_CONTENT).send();
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
