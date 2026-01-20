import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaDumbbell } from 'react-icons/fa'

import { authAPI } from '../services/api'

const SignIn = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(formData)
      
      console.log('✅ Login successful:', response)
      console.log('🔑 Token:', response.token)
      console.log('👤 User:', response.user)
      
      // Token and user are already saved by authAPI.login()
      // Just redirect based on role
      const role = response.user.role
      
      if (role === 'admin') {
        navigate('/admin')
      } else if (role === 'trainer') {
        navigate('/trainer')
      } else if (role === 'trainee') {
        navigate('/trainee')
      }
      
    } catch (err) {
      console.error('❌ Login error:', err)
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side - Sign In Box */}
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="bg-dark-card rounded-2xl p-10 border border-gray-800">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-gray-400">Welcome back to Fit Hub</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="enter your email"
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-crimson transition-all"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-gray-300 text-sm">Password</label>
                  <Link 
                    to="/forgot-password" 
                    className="text-crimson text-xs hover:underline transition-all"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="enter your password"
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-crimson transition-all"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-crimson hover:bg-crimson/90 text-white py-3 rounded-lg font-semibold transition-all shadow-glow-red mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-gray-400 text-center mt-6 text-sm">
              Don't have account?{' '}
              <Link to="/signup" className="text-crimson hover:underline">
                signup
              </Link>
            </p>

            
            
          </div>
        </div>

        {/* Right Side - Circular Image with Icon Box */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative group">
            {/* Red and Zinc/Dark Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-zinc-600 rounded-full blur opacity-25 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative w-[450px] h-[450px] rounded-full overflow-hidden border-2 border-red-600/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000"
                alt="Profile Setup"
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
