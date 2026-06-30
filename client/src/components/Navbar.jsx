import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            MobiDrag Partner Portal
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-white text-blue-600 hover:bg-gray-100 px-3 py-2 rounded font-semibold">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
