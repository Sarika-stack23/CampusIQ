import Task from './task.model.js'

const taskService = {
  // Get all tasks for a user with optional filters
  async getTasks(userId, filters = {}) {
    const query = { userId }

    if (filters.status) query.status = filters.status
    if (filters.priority) query.priority = filters.priority
    if (filters.subject) query.subject = new RegExp(filters.subject, 'i')

    // Today's tasks filter
    if (filters.today === 'true') {
      const start = new Date()
      start.setHours(0, 0, 0, 0)
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      query.deadline = { $gte: start, $lte: end }
    }

    const tasks = await Task.find(query)
      .sort({ deadline: 1, priority: -1 })  // soonest deadline first
      .lean()

    return tasks
  },

  // Get single task
  async getTask(taskId, userId) {
    const task = await Task.findOne({ _id: taskId, userId })
    if (!task) {
      const error = new Error('Task not found')
      error.statusCode = 404
      throw error
    }
    return task
  },

  // Create new task
  async createTask(userId, data) {
    const task = await Task.create({ userId, ...data })
    return task
  },

  // Update task
  async updateTask(taskId, userId, updates) {
    // If marking as done, set completedAt
    if (updates.status === 'done') {
      updates.completedAt = new Date()
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      updates,
      { new: true, runValidators: true }
    )

    if (!task) {
      const error = new Error('Task not found')
      error.statusCode = 404
      throw error
    }

    return task
  },

  // Delete task
  async deleteTask(taskId, userId) {
    const task = await Task.findOneAndDelete({ _id: taskId, userId })
    if (!task) {
      const error = new Error('Task not found')
      error.statusCode = 404
      throw error
    }
    return task
  },

  // Get task summary stats for dashboard
  async getStats(userId) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [total, done, todayTasks, overdue] = await Promise.all([
      Task.countDocuments({ userId, status: { $ne: 'done' } }),
      Task.countDocuments({ userId, status: 'done' }),
      Task.countDocuments({
        userId,
        status: { $ne: 'done' },
        deadline: { $gte: today, $lt: tomorrow }
      }),
      Task.countDocuments({
        userId,
        status: { $ne: 'done' },
        deadline: { $lt: today }
      })
    ])

    return { total, done, todayTasks, overdue }
  }
}

export default taskService