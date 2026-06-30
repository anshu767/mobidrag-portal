import express from 'express'
import { getDashboardData, updateProfile } from '../controllers/dashboardController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, getDashboardData)
router.put('/profile', protect, updateProfile)

export default router
