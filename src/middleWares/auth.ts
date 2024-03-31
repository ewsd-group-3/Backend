import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/apiError';
import { roleRights } from '../config/roles';
import { Staff } from '@prisma/client';

const verifyCallback =
  (
    req: any,
    resolve: (value?: unknown) => void,
    reject: (reason?: unknown) => void,
    requiredRights: string[]
  ) =>
  async (err: unknown, staff: Staff | false, info: unknown) => {
    if (err || info || !staff) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.staff = staff;

    if (requiredRights.length) {
      const staffRights = roleRights.get(staff.role) ?? [];
      const hasRequiredRights = staffRights.some((right) => requiredRights.includes(right));
      // const hasRequiredRights = requiredRights.every((requiredRight) =>
      //   staffRights.includes(requiredRight)
      // );
      // if (!hasRequiredRights && req.params.staffId !== staff.id) {
      if (!hasRequiredRights) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
