import jwt from 'jsonwebtoken'
import User from '../modules/auth/auth.model.js'

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login first.'
      })
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user to request (without password)
    req.user = await User.findById(decoded.id).select('-passwordHash')

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      })
    }

    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.'
    })
  }
}

// Middleware to check if user has Pro plan
const requirePro = (req, res, next) => {
  if (!req.user.isPro) {
    return res.status(403).json({
      success: false,
      message: 'This feature requires CampusIQ Pro. Upgrade to unlock.'
    })
  }
  next()
}

export { protect, requirePro }