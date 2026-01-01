import { useState, useEffect } from 'react'
import { FaCalendarCheck, FaCheckCircle, FaTimesCircle, FaFire, FaHistory } from 'react-icons/fa'
import api from '../../services/api'

export default function TraineeAttendance() {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/trainee/my-attendance')
        setHistory(res.data.history)
        setStats(res.data.stats)
      } catch (err) {
        console.error("Error fetching attendance:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAttendance()
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-500">Loading attendance...</div>

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto">
      
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         
         {/* Total Days */}
         <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-4 bg-green-500/10 rounded-xl text-green-400">
               <FaCheckCircle className="text-2xl" />
            </div>
            <div>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Present</p>
               <p className="text-3xl font-black text-white">{stats?.totalPresent || 0}</p>
            </div>
         </div>

         {/* Monthly Count */}
         <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 rounded-xl text-blue-400">
               <FaCalendarCheck className="text-2xl" />
            </div>
            <div>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">This Month</p>
               <p className="text-3xl font-black text-white">{stats?.thisMonth || 0} <span className="text-sm font-normal text-gray-500">days</span></p>
            </div>
         </div>

         {/* Last Seen */}
         <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-4 bg-orange-500/10 rounded-xl text-orange-400">
               <FaFire className="text-2xl" />
            </div>
            <div>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Last Workout</p>
               <p className="text-lg font-bold text-white">
                 {stats?.lastAttended ? new Date(stats.lastAttended).toLocaleDateString() : 'N/A'}
               </p>
            </div>
         </div>
      </div>

      {/* History List */}
      <div className="bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8">
         <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <FaHistory className="text-gray-400" /> Attendance Log
         </h3>

         {history.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
               No attendance records found.
            </div>
         ) : (
            <div className="space-y-3">
               {history.map((record, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group">
                     
                     <div className="flex items-center gap-4">
                        <div className={`w-2 h-12 rounded-full ${record.status === 'present' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                           <p className="text-white font-bold text-lg">
                              {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                           </p>
                           <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                              {new Date(record.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) !== '12:00 AM' 
                                 ? new Date(record.date).toLocaleTimeString() 
                                 : 'Check-in'}
                           </p>
                        </div>
                     </div>

                     <div className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                        record.status === 'present' 
                           ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                           : 'bg-red-500/10 text-red-400 border-red-500/20'
                     }`}>
                        {record.status}
                     </div>

                  </div>
               ))}
            </div>
         )}
      </div>

    </div>
  )
}
