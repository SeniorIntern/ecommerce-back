import mongoose, { Document, ObjectId, Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

type Product = Document & {
  productName: string;
  owner: ObjectId;
  category: ObjectId;
  description: string;
  price: number;
  stock: number;
  mainImage: string;
  subImages: string[];
};

const productSchema = new Schema<Product>(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    category: {
      ref: 'Category',
      required: true,
      type: Schema.Types.ObjectId
    },
    description: {
      required: true,
      type: String
    },
    mainImage: {
      required: true,
      type: String
    },
    price: {
      default: 0,
      type: Number
    },
    stock: {
      default: 0,
      type: Number
    },
    subImages: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

productSchema.plugin(mongooseAggregatePaginate);

export const Product = mongoose.model('Product', productSchema);
