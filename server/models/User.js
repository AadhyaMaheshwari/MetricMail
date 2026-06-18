import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },

    password: {
      type: String,
      required: false, // Optional for Google OAuth users
      default: null,
    },

    googleId: {
      type: String,
      default: null,
    },

    authMethod: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },

    // Gmail integration fields
    googleAccessToken: {
      type: String,
      default: null,
    },

    googleRefreshToken: {
      type: String,
      default: null,
    },

    gmailConnected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);