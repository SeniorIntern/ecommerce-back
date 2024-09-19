import { Order, Product } from '../models';
import { ApiError, ApiResponse, asyncHandler } from '../utils';

type OrderItem = {
  _id: string;
  productName: string;
  price: number;
  stock: number;
  quantity: number;
};

const getAllOrders = asyncHandler(async (_, res) => {
  const orders = await Order.find();
  res
    .status(200)
    .json(new ApiResponse(200, orders, 'Orders fetched sucessfully'));
});

const getOrdersByUserId = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id;
  if (!ownerId) throw new ApiError(400, 'User not found');

  const { userId } = req.params;

  const orders = await Order.find({ userId })
    .populate('orderItems.productId', 'productName price') // Populate product details
    .exec();

  /*
    if (!orders.length) {
      throw new ApiError(404, 'No orders found for this user.');
    }
  */

  res.status(200).json(new ApiResponse(200, { orders }));
});

const getOrdersByLoggedUser = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id;
  if (!ownerId) throw new ApiError(400, 'User not found');

  const orders = await Order.find({ userId: ownerId })
    .populate('orderItems.productId', 'productName price') // Populate product details
    .exec();

  /*
    if (!orders.length) {
      throw new ApiError(404, 'No orders found for this user.');
    }
  */

  res.status(200).json(new ApiResponse(200, { orders }));
});

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(400, 'User not found');

  const session = await Product.startSession(); // Use session for atomic operations
  session.startTransaction();

  try {
    const { orderItems } = req.body as {
      orderItems: OrderItem[];
    };

    // Calculate total price
    let totalPrice = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item._id).session(session); // Use session for atomic reads
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ message: `Product with ID ${item._id} not found.` });
      }

      // Check if enough stock is available
      if (product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.productName}`
        });
      }

      totalPrice += item.quantity * product.price;

      // Decrease stock
      product.stock -= item.quantity;
      await product.save({ session }); // Save with session to ensure atomicity
    }

    // Create order
    const order = new Order({
      userId,
      orderItems: orderItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice
    });

    await order.save({ session }); // Save order with session

    await session.commitTransaction(); // Commit the transaction if all went well
    session.endSession();

    return res.status(201).json(new ApiResponse(201, order));
  } catch (error) {
    await session.abortTransaction(); // Rollback on failure
    session.endSession();
    // @ts-ignore
    console.log('error=== ===', error.message);

    // throw new ApiError(500, 'Internal Server Error');
  }
});

export { createOrder, getAllOrders, getOrdersByLoggedUser, getOrdersByUserId };
