import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Don't return by default
    },
    preferences: {
      preferredLanguage: {
        type: String,
        default: 'en-US',
      },
      voiceId: {
        type: String,
        default: 'Namrita',
      },
      defaultRole: {
        type: String,
        default: 'MERN Stack Developer',
      },
      defaultDifficulty: {
        type: String,
        default: 'Intermediate',
        enum: ['Beginner', 'Intermediate', 'Advanced'],
      },
      defaultInterviewType: {
        type: String,
        default: 'Technical',
        enum: ['Technical', 'Behavioral', 'HR', 'Mixed'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Method to remove password hash and internal fields when serializing
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

export const User = mongoose.model('User', userSchema);
