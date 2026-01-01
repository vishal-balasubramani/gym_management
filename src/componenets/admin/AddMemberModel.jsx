import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import api from '../../services/api'

export default function AddMemberModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    current_weight: '',
    height: '',
    fitness_goal: '',
    trainer_id: ''
  })
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/admin/trainers')
      setTrainers(response.data.trainers || [])
    } catch (error) {
      console.error('Error fetching trainers:', error)
    }
  }

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
      const response = await api.post('/admin/members', formData)
      
      alert(`✅ Member added successfully!\n\n📧 Email: ${response.data.member.email}\n🔑 Password: ${response.data.member.password}\n\n✉️ Welcome email sent!`)
      
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  // Close modal on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Add New Member</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Assign Trainer</label>
                <select
                  name="trainer_id"
                  value={formData.trainer_id}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">No Trainer</option>
                  {trainers.map((trainer) => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Physical Information */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Physical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Current Weight (kg)</label>
                <input
                  type="number"
                  name="current_weight"
                  value={formData.current_weight}
                  onChange={handleChange}
                  placeholder="70"
                  step="0.1"
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="175"
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Fitness Goal</label>
                <select
                  name="fitness_goal"
                  value={formData.fitness_goal}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">Select Goal</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="fitness">General Fitness</option>
                  <option value="strength">Strength Training</option>
                  <option value="endurance">Endurance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              ℹ️ A random password will be generated and sent to the member's email.
              <br />
              ⚠️ Member status will be <strong>Inactive</strong> until payment is completed.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-crimson hover:bg-crimson/90 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Member...' : 'Add Member'}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClose()
              }}
              disabled={loading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
