import { useState, useEffect } from 'react'
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaAlignLeft, FaStar } from 'react-icons/fa'
import api from '../../services/api'

// ✅ FIX 1: Ensure props are destructured correctly
export default function AddTrainerModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience_years: '',
    bio: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/admin/trainers', formData)
      
      alert(`✅ Trainer added successfully!\n\n📧 Email: ${response.data.trainer.email}\n🔑 Password: ${response.data.trainer.password}\n\n✉️ Welcome email sent!`)
      
      // ✅ FIX 2: Call onSuccess to refresh the parent list
      if (onSuccess) onSuccess()
      
      // ✅ FIX 3: Close the modal immediately after success
      if (onClose) onClose()
      
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to add trainer')
    } finally {
      setLoading(false)
    }
  }

  // ✅ FIX 4: Dedicated Close Handler for Cancel / X buttons
  const handleClose = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (onClose) onClose()
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    // Backdrop with Blur
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        // Close when clicking the dark background overlay
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      {/* Modal Container - Glass Style */}
      <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Add New Trainer</h2>
          <button 
            type="button" 
            onClick={handleClose} 
            className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          {/* Personal Information Section */}
          <div>
            <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="relative group">
                <FaUser className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-orange-500 transition-all placeholder-gray-500"
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative group">
                <FaEnvelope className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-orange-500 transition-all placeholder-gray-500"
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative group">
                <FaPhone className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-orange-500 transition-all placeholder-gray-500"
                  disabled={loading}
                />
              </div>

              <div className="relative group">
                <FaStar className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="number"
                  name="experience_years"
                  placeholder="Experience (years)"
                  value={formData.experience_years}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-orange-500 transition-all placeholder-gray-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Professional Details Section */}
          <div>
            <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Professional Details</h3>
            <div className="space-y-5">
              
              <div className="relative group">
                <FaBriefcase className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  disabled={loading}
                >
                  <option value="" className="bg-gray-800">Select Specialization</option>
                  <option value="Weight Training" className="bg-gray-800">Weight Training</option>
                  <option value="Cardio" className="bg-gray-800">Cardio</option>
                  <option value="Yoga" className="bg-gray-800">Yoga</option>
                  <option value="CrossFit" className="bg-gray-800">CrossFit</option>
                  <option value="Nutrition" className="bg-gray-800">Nutrition</option>
                  <option value="Personal Training" className="bg-gray-800">Personal Training</option>
                </select>
              </div>

              <div className="relative group">
                <FaAlignLeft className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <textarea
                  name="bio"
                  placeholder="Short Bio / Description"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 transition-all resize-none placeholder-gray-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3.5 rounded-xl font-semibold transition-all border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Trainer...' : 'Add Trainer'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
