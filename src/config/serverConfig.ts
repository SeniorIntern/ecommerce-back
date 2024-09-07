import { ConfigOptions } from 'cloudinary';
import { CorsOptions } from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const cloudinaryConfigOptions: ConfigOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

let whitelist = ['http://localhost:3000', 'https://localhost:3000'];

const CORS_OPTIONS: CorsOptions = {
  origin: whitelist,
  optionsSuccessStatus: 200,
  credentials: true
};

export = {
  PORT: process.env.PORT,
  URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_CONFIG: cloudinaryConfigOptions,
  CORS_OPTIONS
};
