import React, { useState, useEffect } from 'react'
import { 
  FaCheck, 
  FaTimes, 
  FaUserCircle, 
  FaSearch, 
  FaWeight, 
  FaRulerVertical, 
  FaChartLine,
  FaBullseye,
  FaLock
} from 'react-icons/fa'
import api from '../../services/api'

export default function AttendanceTab() {
  const [trainees, setTrainees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTrainees()
  }, [])

  const fetchTrainees = async () => {
    try {
      setLoading(true)
      const res = await api.get('/trainer/attendance')
      // Ensure backend query includes s.status as session_status
      setTrainees(res.data || [])
    } catch (err) {
      console.error("Error fetching attendance list:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleMark = async (traineeId, status) => {
    try {
      setTrainees(prev => prev.map(t => 
        t.trainee_id === traineeId ? { ...t, today_status: status } : t
      ))
      await api.post('/trainer/attendance', { traineeId, status })
    } catch (err) {
      alert("Failed to mark attendance. Please try again.")
      fetchTrainees()
    }
  }

  const filteredTrainees = trainees.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const presentCount = trainees.filter(t => t.today_status === 'present').length
  const absentCount = trainees.filter(t => t.today_status === 'absent').length
  const pendingCount = trainees.length - presentCount - absentCount

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-10">
      
      {/* --- Header & Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Daily Attendance</h2>
          <p className="text-gray-400 text-sm">
            Current Session: <span className="text-blue-400 font-medium">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </p>
        </div>
        
        {/* Glass Stats Box - Normal Weights & Standard Tracking */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex justify-between items-center text-center shadow-xl">
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total</p>
            <p className="text-white font-bold text-2xl">{trainees.length}</p>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div>
            <p className="text-green-500 text-xs font-semibold uppercase tracking-wider">Present</p>
            <p className="text-white font-bold text-2xl">{presentCount}</p>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div>
            <p className="text-red-500 text-xs font-semibold uppercase tracking-wider">Absent</p>
            <p className="text-white font-bold text-2xl">{absentCount}</p>
          </div>
        </div>
      </div>

      {/* --- Search Bar --- */}
      <div className="relative mb-8 group">
        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search student by name or email..." 
          className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-14 pr-6 text-sm text-white focus:border-blue-500/50 outline-none transition-all placeholder-gray-600 shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Syncing Roster...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrainees.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-white/5 rounded-3xl border border-white/5 border-dashed">
              <FaUserCircle className="mx-auto text-3xl mb-4 opacity-20" />
              <p className="text-base font-medium">No active students found for today.</p>
            </div>
          ) : (
            filteredTrainees.map((trainee) => (
              <div 
                key={trainee.trainee_id} 
                className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between hover:border-blue-500/30 transition-all group gap-6 shadow-lg"
              >
                
                <div className="flex items-center gap-5 flex-1 w-full">
                  {trainee.profile_picture ? (
                    <img 
                      src={trainee.profile_picture} 
                      alt={trainee.name} 
                      className="w-14 h-14 rounded-xl object-cover border border-white/5 group-hover:border-blue-500/40 transition-colors" 
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center text-gray-600 text-2xl border border-white/5">
                      <FaUserCircle />
                    </div>
                  )}
                  
                  <div className="space-y-2 flex-1">
                    <div>
                      <h4 className="text-white font-bold text-lg leading-tight">{trainee.name}</h4>
                      {/* Locked Status Message - Normal Style */}
                      {trainee.session_status === 'completed' && (
                        <p className="text-orange-500/90 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                          <FaLock size={9} /> Session Finished
                        </p>
                      )}
                    </div>
                    
                    {/* PHYSICAL METRICS ROW - Normal weights */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2 bg-blue-500/10 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase text-blue-400 border border-blue-500/5">
                        <FaRulerVertical /> {trainee.height || '--'} CM
                      </div>
                      <div className="flex items-center gap-2 bg-purple-500/10 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase text-purple-400 border border-purple-500/5">
                        <FaWeight /> {trainee.current_weight || '--'} KG
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-500/10 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase text-emerald-400 border border-emerald-500/5">
                        <FaChartLine /> BMI: {trainee.bmi || '--'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mark Attendance Actions - LOCK LOGIC APPLIED */}
                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <button 
                    disabled={trainee.session_status === 'completed'}
                    onClick={() => handleMark(trainee.trainee_id, 'present')}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                      trainee.today_status === 'present' 
                        ? 'bg-green-600 text-white border-green-500 shadow-lg' 
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-green-500 hover:text-green-500'
                    } ${trainee.session_status === 'completed' ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <FaCheck /> Present
                  </button>

                  <button 
                    disabled={trainee.session_status === 'completed'}
                    onClick={() => handleMark(trainee.trainee_id, 'absent')}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                      trainee.today_status === 'absent' 
                        ? 'bg-red-600 text-white border-red-500 shadow-lg' 
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-red-500 hover:text-red-500'
                    } ${trainee.session_status === 'completed' ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <FaTimes /> Absent
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}