import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import api from '../../services/api'

export default function ScheduleSessionModal({ onClose, onSuccess }) {
  const [trainers, setTrainers] = useState([])
  const [trainees, setTrainees] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    trainerId: '',
    traineeId: '',
    sessionDate: '',
    sessionTime: '',
    durationMinutes: '60',
    notes: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainersRes, membersRes] = await Promise.all([
          api.get('/admin/trainers'),
          api.get('/admin/members')
        ])
        setTrainers(trainersRes.data.trainers || [])
        setTrainees(membersRes.data.members || [])
      } catch (err) {
        console.error("Error loading selection data", err)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/admin/sessions', formData)
      alert('✅ Session scheduled successfully!')
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    } catch (error) {
      alert('❌ Failed to schedule session')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Schedule Session</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Trainer</label>
              <select name="trainerId" onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 outline-none" required>
                <option value="">Select Trainer</option>
                {trainers.map(t => <option key={t.user_id} value={t.user_id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Trainee</label>
              <select name="traineeId" onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 outline-none" required>
                <option value="">Select Trainee</option>
                {trainees.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Date</label>
              <input type="date" name="sessionDate" onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 outline-none" required />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Time</label>
              <input type="time" name="sessionTime" onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 outline-none" required />
            </div>
          </div>

          <div>
             <label className="block text-gray-300 text-sm mb-2">Duration (minutes)</label>
             <input type="number" name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 outline-none" required />
          </div>

          <div>
             <label className="block text-gray-300 text-sm mb-2">Notes</label>
             <textarea name="notes" rows="2" onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 outline-none" placeholder="Workout focus, injuries, etc." />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg mt-2">
            {loading ? 'Scheduling...' : 'Confirm Schedule'}
          </button>
        </form>
      </div>
    </div>
  )
}
