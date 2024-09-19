import mongoose, { Document, ObjectId, Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

type Order = Document & {
  userId: ObjectId;
  orderItems: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number; // storing the product price at the time of order
  }[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

const orderSchema = new Schema<Order>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderItems: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true // Price at the time of purchase
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

orderSchema.plugin(mongooseAggregatePaginate);

export const Order = mongoose.model('Order', orderSchema);
