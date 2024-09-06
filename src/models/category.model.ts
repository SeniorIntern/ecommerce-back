import mongoose, { Document, ObjectId, Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

type Category = Document & {
  categoryName: string;
  owner: ObjectId;
};

const categorySchema = new Schema<Category>(
  {
    categoryName: {
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
    }
  },
  {
    timestamps: true
  }
);

categorySchema.plugin(mongooseAggregatePaginate);

export const Category = mongoose.model('Category', categorySchema);
