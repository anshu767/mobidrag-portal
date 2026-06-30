export const getDashboardData = async (req, res) => {
  try {
    const dashboardData = {
      activeDeliveries: 12,
      completedToday: 45,
      revenueToday: 1250,
      rating: 4.8,
      totalDeliveries: 2300,
      weeklyRevenue: 8750,
      recentDeliveries: [
        { id: 1, location: 'Downtown', status: 'In Transit', time: '2 mins ago' },
        { id: 2, location: 'Airport', status: 'Delivered', time: '15 mins ago' },
        { id: 3, location: 'Mall', status: 'In Transit', time: '30 mins ago' }
      ]
    }

    res.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, companyName, address, city, state, zipCode } = req.body

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        name,
        phone,
        companyName,
        address,
        city,
        state,
        zipCode
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
