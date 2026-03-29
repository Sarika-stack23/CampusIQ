import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false  // never returned in queries by default
    },
    college: {
      type: String,
      trim: true,
      default: ''
    },
    branch: {
      type: String,
      trim: true,
      default: ''
    },
    semester: {
      type: Number,
      min: 1,
      max: 12,
      default: 1
    },
    stream: {
      type: String,
      enum: ['engineering', 'medical', 'arts', 'commerce', 'mba', 'other'],
      default: 'engineering'
    },
    placementMode: {
      type: Boolean,
      default: false
    },
    isPro: {
      type: Boolean,
      default: false
    },
    proExpiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true  // adds createdAt and updatedAt automatically
  }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password was modified
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
  next()
})

// Method to compare passwords on login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash)
}

const User = mongoose.model('User', userSchema)
export default User