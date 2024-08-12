import mongoose, { Document, ObjectId, Schema } from 'mongoose';

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

export const Category = mongoose.model('Category', categorySchema);
