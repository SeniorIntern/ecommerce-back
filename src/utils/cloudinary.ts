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

    try {
      fs.unlinkSync(localFilePath); // remove local file
    } catch (err) {
      console.error(`Failed to unlinkSync (delete local file): ${localFilePath}`, err);
    }
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove local file
    return null;
  }
};

export { uploadOnCloudinary };
