import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import Attendance from './attendance.model.js'
import { protect } from '../../middlewares/auth.js'

const router = Router()
router.use(protect)

// GET /api/attendance — all subjects
router.get('/', async (req, res, next) => {
  try {
    const subjects = await Attendance.find({ userId: req.user._id }).sort({ subject: 1 })

    // Add helper fields for UI
    const enriched = subjects.map(s => ({
      ...s.toObject(),
      isSafe: s.percentage >= s.requiredPercentage,
      classesCanSkip: Math.max(
        0,
        Math.floor(s.attended - (s.requiredPercentage / 100) * s.totalClasses)
      ),
      classesNeeded: s.percentage < s.requiredPercentage
        ? Math.ceil(
            (s.requiredPercentage * s.totalClasses - 100 * s.attended) /
            (100 - s.requiredPercentage)
          )
        : 0
    }))

    res.json({ success: true, data: { subjects: enriched } })
  } catch (error) {
    next(error)
  }
})

// POST /api/attendance — add new subject
router.post(
  '/',
  [body('subject').trim().notEmpty().withMessage('Subject name is required')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg })
      }

      const subject = await Attendance.create({
        userId: req.user._id,
        subject: req.body.subject,
        requiredPercentage: req.body.requiredPercentage || 75,
        color: req.body.color || '#7F77DD'
      })

      res.status(201).json({ success: true, message: 'Subject added', data: { subject } })
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Subject already exists' })
      }
      next(error)
    }
  }
)

// PATCH /api/attendance/:id/mark — mark present or absent
router.patch('/:id/mark', async (req, res, next) => {
  try {
    const { attended } = req.body  // true = present, false = absent

    const subject = await Attendance.findOne({ _id: req.params.id, userId: req.user._id })
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' })
    }

    subject.totalClasses += 1
    if (attended) subject.attended += 1
    await subject.save()  // triggers percentage recalculation

    res.json({
      success: true,
      message: attended ? 'Marked present' : 'Marked absent',
      data: { subject }
    })
  } catch (error) {
    next(error)
  }
})

// PATCH /api/attendance/:id — update subject details
router.patch('/:id', async (req, res, next) => {
  try {
    const subject = await Attendance.findOne({ _id: req.params.id, userId: req.user._id })
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' })
    }

    const allowed = ['subject', 'totalClasses', 'attended', 'requiredPercentage', 'color']
    allowed.forEach(key => {
      if (req.body[key] !== undefined) subject[key] = req.body[key]
    })

    await subject.save()
    res.json({ success: true, message: 'Subject updated', data: { subject } })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/attendance/:id — remove subject
router.delete('/:id', async (req, res, next) => {
  try {
    await Attendance.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    res.json({ success: true, message: 'Subject removed' })
  } catch (error) {
    next(error)
  }
})

export default router