import prisma from '../prisma';
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import config from './config';
import { TokenType } from '@prisma/client';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify: VerifyCallback = async (payload, done) => {
  try {
    if (payload.type !== TokenType.ACCESS) {
      throw new Error('Invalid token type');
    }
    const staff = await prisma.staff.findUnique({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      },
      where: { id: payload.sub }
    });
    if (!staff) {
      return done(null, false);
    }
    done(null, staff);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
