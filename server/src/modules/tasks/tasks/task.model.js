import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true  // faster queries
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title too long']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    subject: {
      type: String,
      trim: true,
      default: 'General'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'done'],
      default: 'pending'
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required']
    },
    estimatedMins: {
      type: Number,
      default: 60,
      min: 5
    },
    actualMins: {
      type: Number,
      default: null
    },
    tags: {
      type: [String],
      default: []
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// Compound index for fast user + deadline queries
taskSchema.index({ userId: 1, deadline: 1 })
taskSchema.index({ userId: 1, status: 1 })

const Task = mongoose.model('Task', taskSchema)
export default Task