import { Response } from 'express';
import { ApiResponse, asyncHandler } from '../utils';

const getAllUsers = asyncHandler(async (_, res: Response) => {
  const data = {
    id: 1,
    name: 'John Smith'
  };
  res.status(200).json(new ApiResponse(200, data));
});

export { getAllUsers };
