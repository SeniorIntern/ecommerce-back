import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { logger } from '../logger';
import { ApiError } from '../utils';

dotenv.config({
  path: './.env'
});

const errorHandler = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  let error = err;

  // Check if the error is an instance of an ApiError class which extends native Error class
  if (!(error instanceof ApiError)) {
    // if not
    // create a new ApiError instance to keep the consistency

    // assign an appropriate status code
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    // set a message from native Error instance or a custom one
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Now we are sure that the `error` variable will be an instance of ApiError class
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}) // Error stack traces should be visible in development for debugging
  };

  logger.error(`${error.message}`);

  // Send error response
  return res.status(error.statusCode).json(response);
};

export { errorHandler };
