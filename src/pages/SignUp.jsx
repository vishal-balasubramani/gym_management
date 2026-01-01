import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { FaPhoneAlt } from 'react-icons/fa' // Ensure icons are imported

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '', // ✅ Correct state key
    role: 'trainee'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // ✅ formData already contains name, email, password, and phone
      const response = await authAPI.register(formData)
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      console.log('✅ Registration successful:', response)
      navigate('/complete-profile')
      
    } catch (err) {
      console.error('❌ Registration error:', err)
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side Form */}
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Join Fit Hub</h2>
              <p className="text-gray-400">Step 1: Create your account credentials</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-normal"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-normal"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-normal"
                  required
                />
              </div>

              {/* Phone Number - RECTIFIED ✅ */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2 text-sm font-medium">
                   Phone Number
                </label>
                <input
                  type="tel"
                  name="phone" // ✅ Matches key in formData
                  value={formData.phone} // ✅ Changed from details.phone to formData.phone
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-normal"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3.5 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20 mt-6"
              >
                {loading ? 'Creating Account...' : 'Continue to Profile →'}
              </button>
            </form>

            <p className="text-gray-400 text-center mt-8 text-sm">
              Already a member?{' '}
              <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="hidden lg:flex items-center justify-center">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-[450px] h-[450px] rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                    <img
                        src="https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Profile Setup"
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp