import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import api from '../../services/api'

export default function MarkAttendanceModal({ onClose, onSuccess }) {
  const [members, setMembers] = useState([])
  const [formData, setFormData] = useState({
    userId: '',
    checkInTime: new Date().toTimeString().slice(0, 5), // Default current time HH:MM
    checkOutTime: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/admin/members')
        setMembers(res.data.members || [])
      } catch (err) { console.error(err) }
    }
    fetchMembers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/admin/attendance', formData)
      alert('✅ Attendance marked successfully!')
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    } catch (error) {
      alert('❌ Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Manual Check-In</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Member</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 outline-none focus:border-blue-500"
              value={formData.userId}
              onChange={(e) => setFormData({...formData, userId: e.target.value})}
              required
            >
              <option value="">-- Select Member --</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Check In Time</label>
              <input
                type="time"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 outline-none focus:border-blue-500"
                value={formData.checkInTime}
                onChange={(e) => setFormData({...formData, checkInTime: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Check Out (Optional)</label>
              <input
                type="time"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 outline-none focus:border-blue-500"
                value={formData.checkOutTime}
                onChange={(e) => setFormData({...formData, checkOutTime: e.target.value})}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2"
          >
            {loading ? 'Saving...' : 'Save Record'}
          </button>
        </form>
      </div>
    </div>
  )
}
