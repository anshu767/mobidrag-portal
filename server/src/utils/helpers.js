// Response utility for consistent API responses
export const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message
  }
  if (data) response.data = data
  return res.status(statusCode).json(response)
}

export const errorResponse = (res, statusCode, message, error = null) => {
  const response = {
    success: false,
    message
  }
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error
  }
  return res.status(statusCode).json(response)
}

// Validation utilities
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  password: (password) => {
    // Minimum 6 characters
    return password && password.length >= 6
  },
  
  name: (name) => {
    return name && name.trim().length >= 2
  },
  
  phone: (phone) => {
    if (!phone) return true
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }
}
