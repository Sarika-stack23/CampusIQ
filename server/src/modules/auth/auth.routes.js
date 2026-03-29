import { Router } from 'express'
import { body } from 'express-validator'
import authController from './auth.controller.js'
import { protect } from '../../middlewares/auth.js'

const router = Router()

// Validation rules
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
]

const loginRules = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
]

// Routes
router.post('/register', registerRules, authController.register)
router.post('/login', loginRules, authController.login)
router.get('/me', protect, authController.getMe)
router.patch('/profile', protect, authController.updateProfile)

export default router