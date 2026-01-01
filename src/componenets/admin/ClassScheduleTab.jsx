import { useState, useEffect } from 'react'
import { FaClock, FaUser, FaChalkboardTeacher, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa'
import api from '../../services/api'

export default function ClassScheduleTab() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/sessions')
      setSessions(response.data.sessions || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group sessions by date
  const groupedSessions = sessions.reduce((groups, session) => {
    const date = new Date(session.session_date).toDateString()
    if (!groups[date]) groups[date] = []
    groups[date].push(session)
    return groups
  }, {})

  return (
    <div className="max-w-7xl mx-auto pb-12">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Class Schedule</h1>
          <p className="text-gray-400">Read-only view of all upcoming training sessions.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-300 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 shadow-lg">
          <FaInfoCircle />
          <span>Updates automatically</span>
        </div>
      </div>

      {/* --- Content Grid --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-gray-300 font-medium">Loading schedule...</p>
        </div>
      ) : Object.keys(groupedSessions).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
           <div className="bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-gray-500 border border-white/5">
             <FaCalendarAlt size={40} />
           </div>
           <h3 className="text-white text-2xl font-bold mb-2">No Scheduled Sessions</h3>
           <p className="text-gray-400 max-w-md text-center">There are no upcoming training sessions scheduled at the moment.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedSessions).map(([date, daySessions]) => (
            <div key={date} className="animate-fade-in">
              
              {/* Date Header - Improved Layout */}
              <div className="flex items-center gap-4 mb-6 pb-2 border-b border-white/10">
                <div className="bg-blue-600/20 text-blue-400 p-3 rounded-lg">
                  <FaCalendarAlt size={20} />
                </div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-wide">
                  {date}
                </h3>
                <span className="ml-auto bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-700">
                  {daySessions.length} {daySessions.length === 1 ? 'Session' : 'Sessions'}
                </span>
              </div>
              
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {daySessions.map((session) => (
                  <div key={session.id} className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all group relative overflow-hidden">
                    
                    {/* Status Strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      session.status === 'completed' ? 'bg-green-500' : 
                      session.status === 'cancelled' ? 'bg-red-500' : 
                      'bg-blue-500'
                    }`}></div>

                    {/* Time Header */}
                    <div className="flex justify-between items-center mb-6 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-black/30 p-2 rounded-lg text-blue-400">
                           <FaClock />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                          {session.session_time.slice(0, 5)}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        session.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                        session.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    
                    {/* People Info */}
                    <div className="space-y-4 pl-2">
                      {/* Trainer */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 text-sm">
                          <FaChalkboardTeacher />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Trainer</p>
                          <p className="text-white font-medium text-sm truncate">{session.trainer_name}</p>
                        </div>
                      </div>

                      {/* Trainee */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0 text-sm">
                          <FaUser />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Trainee</p>
                          <p className="text-white font-medium text-sm truncate">{session.trainee_name}</p>
                        </div>
                      </div>
                    </div>

                    {/* Notes Footer */}
                    {session.notes && (
                      <div className="mt-6 pt-4 border-t border-white/5 pl-2">
                        <p className="text-gray-400 text-xs italic line-clamp-2">
                          "{session.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
