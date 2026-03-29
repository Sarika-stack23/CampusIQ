import jwt from 'jsonwebtoken'
import User from './auth.model.js'

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

// Format user for response (remove sensitive fields)
const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  college: user.college,
  branch: user.branch,
  semester: user.semester,
  stream: user.stream,
  placementMode: user.placementMode,
  isPro: user.isPro,
  createdAt: user.createdAt
})

const authService = {
  // Register new user
  async register({ name, email, password, college, branch, semester, stream }) {
    // Check if email already taken
    const existing = await User.findOne({ email })
    if (existing) {
      const error = new Error('An account with this email already exists')
      error.statusCode = 400
      throw error
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password,  // pre-save hook hashes this
      college: college || '',
      branch: branch || '',
      semester: semester || 1,
      stream: stream || 'engineering'
    })

    const token = generateToken(user._id)
    return { user: formatUser(user), token }
  },

  // Login existing user
  async login({ email, password }) {
    // Include passwordHash in this query (it's excluded by default)
    const user = await User.findOne({ email }).select('+passwordHash')

    if (!user) {
      const error = new Error('Invalid email or password')
      error.statusCode = 401
      throw error
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      const error = new Error('Invalid email or password')
      error.statusCode = 401
      throw error
    }

    const token = generateToken(user._id)
    return { user: formatUser(user), token }
  },

  // Update profile
  async updateProfile(userId, updates) {
    const allowed = ['name', 'college', 'branch', 'semester', 'stream', 'placementMode']
    const filtered = {}
    allowed.forEach(key => {
      if (updates[key] !== undefined) filtered[key] = updates[key]
    })

    const user = await User.findByIdAndUpdate(userId, filtered, {
      new: true,
      runValidators: true
    })

    return formatUser(user)
  }
}

export default authService