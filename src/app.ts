import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';
import requestIp from 'request-ip';
import { logger } from './logger';
import { errorHandler } from './middlewares';

dotenv.config({
  path: './.env'
});

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);

app.use(requestIp.mw());

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 15 requests per `window` (here, per 1 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: any, _) => {
    return req.clientIp; // IP address from requestIp.mw(), as opposed to req.ip
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${options.limit
      } requests per ${options.windowMs / 60000} minutes`
    );
  }
});

// Apply rate limiting to all requests
app.use(limiter);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// logging
const morganFormat = ':method :url :status :response-time ms';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(' ')[0],
          url: message.split(' ')[1],
          status: message.split(' ')[2],
          responseTime: message.split(' ')[3]
        };
        logger.info(JSON.stringify(logObject));
      }
    }
  })
);

//routes import
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import userRouter from './routes/user.routes';
import { ApiError } from './utils';

//routes declaration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
// missing routes- address, orders

// error middleware
app.use(errorHandler);

export { app };
