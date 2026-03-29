import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    subject: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true
    },
    totalClasses: {
      type: Number,
      default: 0,
      min: 0
    },
    attended: {
      type: Number,
      default: 0,
      min: 0
    },
    // Calculated field — updated on every change
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    // Minimum required percentage (default 75%)
    requiredPercentage: {
      type: Number,
      default: 75
    },
    // Color tag for UI
    color: {
      type: String,
      default: '#7F77DD'
    }
  },
  {
    timestamps: true
  }
)

// Auto-calculate percentage before saving
attendanceSchema.pre('save', function (next) {
  if (this.totalClasses > 0) {
    this.percentage = Math.round((this.attended / this.totalClasses) * 100)
  } else {
    this.percentage = 0
  }
  next()
})

// One subject per user (no duplicates)
attendanceSchema.index({ userId: 1, subject: 1 }, { unique: true })

const Attendance = mongoose.model('Attendance', attendanceSchema)
export default Attendance