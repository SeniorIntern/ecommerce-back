import { NextFunction, Request, Response } from 'express';

type UserRequest = Request & {
  user?: {
    _id: string;
  };
};

const asyncHandler = (
  requestHandler: (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
