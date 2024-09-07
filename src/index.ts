import dotenv from 'dotenv';
import { app } from './app';
import { serverConfig } from './config';
import connectDB from './db';

dotenv.config({
  path: './.env'
});

const { PORT } = serverConfig;

connectDB()
  .then(() => {
    app.listen(PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.log('MONGO db connection failed !!! ', err);
  });
