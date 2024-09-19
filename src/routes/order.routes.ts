import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrdersByLoggedUser,
  getOrdersByUserId
} from '../controllers/order.controller';
import { verifyJWT } from '../middlewares';

const router = Router();

router.route('/').get(verifyJWT, getAllOrders).post(verifyJWT, createOrder);
router.route('/user/:userId').get(verifyJWT, getOrdersByUserId);
router.route('/my-orders').get(verifyJWT, getOrdersByLoggedUser);

export default router;
