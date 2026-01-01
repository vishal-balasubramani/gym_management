import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import api from '../../services/api'

export default function EditTrainerModal({ trainer, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: trainer.name || '',
    email: trainer.email || '',
    phone: trainer.phone || '',
    specialization: trainer.specialization || '',
    experience_years: trainer.experience_years || '',
    bio: trainer.bio || ''
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
      await api.put(`/admin/trainers/${trainer.user_id}`, formData)
      alert('✅ Trainer updated successfully!')
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update trainer')
    } finally {
      setLoading(false)
    }
  }

  const handleOverlayClick = (e) => { if (e.target === e.currentTarget) onClose() }
  
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Trainer</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <FaTimes size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg">{error}</div>}
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500" required disabled={loading} />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500" required disabled={loading} />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500" disabled={loading} />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Experience (years)</label>
                <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} min="0" className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500" disabled={loading} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Professional Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Specialization</label>
                <select name="specialization" value={formData.specialization} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500" disabled={loading}>
                  <option value="">Select Specialization</option>
                  <option value="Weight Training">Weight Training</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Yoga">Yoga</option>
                  <option value="CrossFit">CrossFit</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Personal Training">Personal Training</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 resize-none" disabled={loading} />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50">
              {loading ? 'Updating...' : 'Update Trainer'}
            </button>
            <button type="button" onClick={(e) => { e.preventDefault(); onClose(); }} disabled={loading} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
