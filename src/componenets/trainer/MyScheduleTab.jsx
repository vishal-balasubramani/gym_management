import { useState, useEffect } from 'react'
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaPhone, 
  FaUserCheck, 
  FaTrash 
} from 'react-icons/fa'
import api from '../../services/api'

function SessionCard({ session, onAccept, onComplete, onCancel, onDelete }) {
  const isPending = session.status === 'pending'
  const isBooked = session.status === 'booked'
  const isCompleted = session.status === 'completed'
  const isPast = new Date(session.session_date) < new Date().setHours(0,0,0,0)

  return (
    <div className={`group border rounded-2xl p-6 transition-all relative overflow-hidden ${
      isPending ? 'bg-orange-500/10 border-orange-500/30' : 'bg-gray-900/40 border-white/10'
    }`}>
      {/* Status Label */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black border ${
        isPending ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 
        session.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      }`}>
        {session.status.toUpperCase()}
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-white font-bold border border-white/10">
          {session.trainee_name?.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-white text-lg">{session.trainee_name}</h4>
          <p className="text-xs text-gray-500 flex items-center gap-1"><FaPhone size={10}/> {session.phone || 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <FaCalendarAlt className="text-emerald-500" /> {new Date(session.session_date).toLocaleDateString()}
        </div>
        <div className="text-sm font-bold text-white flex items-center gap-2">
          <FaClock className="text-blue-500" /> {session.session_time.slice(0,5)}
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-white/5">
        {isPending && (
          <button onClick={() => onAccept(session.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all">
            <FaUserCheck /> Accept
          </button>
        )}
        
        {isBooked && !isPast && (
          <button onClick={() => onComplete(session.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all">
            <FaCheckCircle /> Finish
          </button>
        )}

        {/* REMOVE OPTION: Only appears for Completed Sessions */}
        {isCompleted && (
          <button 
            onClick={() => onDelete(session.id)} 
            className="flex-1 bg-gray-800 hover:bg-red-600/20 text-gray-400 hover:text-red-500 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all border border-white/5 hover:border-red-500/20"
          >
            <FaTrash size={10} /> Remove Record
          </button>
        )}

        {(isPending || isBooked) && (
          <button onClick={() => onCancel(session.id)} className="flex-1 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all border border-red-500/20">
            <FaTimesCircle /> {isPending ? 'Reject' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function MyScheduleTab() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const res = await api.get('/trainer/my-sessions')
      // Note: Backend excludes status='deleted' from this result
      setSessions(res.data.sessions || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSessions() }, [])

  const handleAccept = async (id) => {
    try {
      await api.post('/trainer/request-action', { sessionId: id, action: 'accept' })
      fetchSessions()
    } catch (err) { alert(err.response?.data?.message || 'Error accepting') }
  }

  const handleComplete = async (id) => {
    if (!confirm('Mark session as complete? Trainee will be disconnected.')) return
    try {
      await api.post('/trainer/update-session', { session_id: id, status: 'completed' })
      fetchSessions()
    } catch (err) { alert('Error updating') }
  }

  // DELETE HANDLER: Removes the session card from the UI
  const handleDelete = async (id) => {
    if (!confirm('Permanently remove this session from your history?')) return
    try {
      // Soft-delete: update status to 'deleted'
      await api.post('/trainer/update-session', { session_id: id, status: 'deleted' })
      // Immediately remove the "div" from the local state list
      setSessions(prev => prev.filter(s => s.id !== id))
    } catch (err) { 
      alert('Error deleting record. Ensure your database allows "deleted" status.') 
    }
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse font-medium">Syncing schedule...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5">
          <FaCalendarAlt className="mx-auto text-gray-600 mb-4" size={40} />
          <p className="text-gray-400">No session requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map(s => (
            <SessionCard 
              key={s.id} 
              session={s} 
              onAccept={handleAccept} 
              onComplete={handleComplete} 
              onDelete={handleDelete}
              onCancel={(id) => api.post('/trainer/update-session', { session_id: id, status: 'cancelled' }).then(fetchSessions)}
            />
          ))}
        </div>
      )}
    </div>
  )
}