import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { ApiError, asyncHandler } from '../utils';

dotenv.config({
  path: './.env'
});

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    // @ts-ignore
    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken'
    );

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token');
    }

    // @ts-ignore
    req.user = user;
    next();
  } catch (error) {
    // @ts-ignore
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});
