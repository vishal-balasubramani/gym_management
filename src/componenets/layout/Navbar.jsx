import { Link } from 'react-router-dom'
import { FaDumbbell } from 'react-icons/fa'

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-crimson rounded-lg flex items-center justify-center">
              <FaDumbbell className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold text-white">Fit Hub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white hover:text-electric-blue transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-400 hover:text-electric-blue transition-colors">
              About
            </Link>
            <Link to="/features" className="text-gray-400 hover:text-electric-blue transition-colors">
              Features
            </Link>
            <Link to="/plans" className="text-gray-400 hover:text-electric-blue transition-colors">
              Plans
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-electric-blue transition-colors">
              Contact
            </Link>
          </div>

          {/* Join Now Button */}
          <Link 
            to="/signup" 
            className="bg-crimson hover:bg-crimson/90 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-glow-red"
          >
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
