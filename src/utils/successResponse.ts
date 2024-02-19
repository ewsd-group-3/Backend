import { Response } from 'express';

const successResponse = (res: Response, statusCode: number, message: string, data = {}) => {
  res.status(statusCode).send({
    statusCode: statusCode,
    message,
    data
  });
};

export default successResponse;
