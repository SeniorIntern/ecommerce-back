import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import { serverConfig } from '../config';

dotenv.config({
  path: './.env'
});

const {
  CLOUDINARY_CONFIG: { cloud_name, api_key, api_secret }
} = serverConfig;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    });
    fs.unlinkSync(localFilePath); // remove local file
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove local file
    return null;
  }
};

export { uploadOnCloudinary };
