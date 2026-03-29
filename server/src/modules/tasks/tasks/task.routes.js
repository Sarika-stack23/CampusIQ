import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import taskService from './task.service.js'
import { protect } from '../../middlewares/auth.js'

const router = Router()

// All task routes require login
router.use(protect)

// Validation
const taskRules = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('deadline').isISO8601().withMessage('Valid deadline date is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority')
]

// GET /api/tasks — get all tasks (with optional filters)
router.get('/', async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks(req.user._id, req.query)
    res.json({ success: true, data: { tasks } })
  } catch (error) {
    next(error)
  }
})

// GET /api/tasks/stats — dashboard summary
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await taskService.getStats(req.user._id)
    res.json({ success: true, data: { stats } })
  } catch (error) {
    next(error)
  }
})

// GET /api/tasks/:id — single task
router.get('/:id', async (req, res, next) => {
  try {
    const task = await taskService.getTask(req.params.id, req.user._id)
    res.json({ success: true, data: { task } })
  } catch (error) {
    next(error)
  }
})

// POST /api/tasks — create task
router.post('/', taskRules, async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg })
    }
    const task = await taskService.createTask(req.user._id, req.body)
    res.status(201).json({ success: true, message: 'Task created', data: { task } })
  } catch (error) {
    next(error)
  }
})

// PATCH /api/tasks/:id — update task
router.patch('/:id', async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user._id, req.body)
    res.json({ success: true, message: 'Task updated', data: { task } })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/tasks/:id — delete task
router.delete('/:id', async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user._id)
    res.json({ success: true, message: 'Task deleted' })
  } catch (error) {
    next(error)
  }
})

export default router