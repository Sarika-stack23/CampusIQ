import { validationResult } from 'express-validator'
import authService from './auth.service.js'

const authController = {
  // POST /api/auth/register
  async register(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg
        })
      }

      const { user, token } = await authService.register(req.body)

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: { user, token }
      })
    } catch (error) {
      next(error)
    }
  },

  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg
        })
      }

      const { user, token } = await authService.login(req.body)

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { user, token }
      })
    } catch (error) {
      next(error)
    }
  },

  // GET /api/auth/me
  async getMe(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: { user: req.user }
      })
    } catch (error) {
      next(error)
    }
  },

  // PATCH /api/auth/profile
  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user._id, req.body)
      res.status(200).json({
        success: true,
        message: 'Profile updated',
        data: { user }
      })
    } catch (error) {
      next(error)
    }
  }
}

export default authController