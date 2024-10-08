import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Schema } from 'mongoose';
import { AvailableUserRoles, UserRolesEnum } from '../constants';

dotenv.config({
  path: './.env'
});

type User = Document & {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  address: string;
  password: string;
  refreshToken: string;
  role: string;
  generateRefreshToken: () => string;
  generateAccessToken: () => string;
  isPasswordCorrect: (password: string) => Promise<boolean>;
};

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRolesEnum.USER,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    refreshToken: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
      username: this.username,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};

export const User = mongoose.model('User', userSchema);
