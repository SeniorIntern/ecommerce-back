import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { serverConfig } from './config';
import { DB_NAME } from './constants';

dotenv.config({
  path: './.env'
});

const { URI } = serverConfig;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${URI}/${DB_NAME}`);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log('MONGODB connection FAILED ', error);
    process.exit(1);
  }
};

export default connectDB;
