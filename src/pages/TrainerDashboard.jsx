import { useState, useEffect } from 'react'
import { FaUserFriends, FaClipboardList, FaCalendarCheck, FaStar, FaDumbbell, FaAppleAlt, FaComments, FaChartLine } from 'react-icons/fa'
import api from '../services/api'
import Sidebar from '../componenets/Sidebar'
import WorkoutPlansTab from '../componenets/trainer/WorkoutPlansTab'
import MyTraineesTab from '../componenets/trainer/MyTraineesTab'
import DietPlansTab from '../componenets/trainer/DietPlansTab'
import MyScheduleTab from '../componenets/trainer/MyScheduleTab'
import AttendanceTab from '../componenets/trainer/AttendanceTab'
import ProgressTab from '../componenets/trainer/ProgressTab'
import MessagesTab from '../componenets/trainer/MessagesTab'





export default function TrainerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    assignedTrainees: 0,
    todaySessions: 0,
    plansCreated: 0,
    averageRating: 0,
    recentSessions: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/trainer/dashboard-stats')
        
        // --- FIX 1: Ensure recentSessions is always an array ---
        const data = res.data.stats || {}
        setStats({
            ...data,
            recentSessions: data.recentSessions || [] 
        })
        
      } catch (err) {
        console.error("Error fetching trainer stats:", err)
      } finally {
        setLoading(false)
      }
    }
    if (activeTab === 'dashboard') fetchStats()
  }, [activeTab])

  return (
    <div className="min-h-screen flex relative bg-black">
      {/* Background Image - MATCHING ADMIN DASHBOARD */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://i.shgcdn.com/d61f124a-5eb2-41c7-abd1-ace0dd6f7d97/-/format/auto/-/preview/3000x3000/-/quality/lighter/"
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Sidebar */}
      <div className="relative z-10 h-screen">
        <Sidebar role="trainer" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 ml-64 p-8 overflow-y-auto h-screen text-white">
        
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            
            {/* --- HEADER --- */}
            <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 flex justify-between items-center shadow-xl">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-blue-200">Welcome back, Trainer!</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-gray-300 text-sm uppercase tracking-wider font-semibold">Current Date</p>
                <p className="text-white font-mono text-xl">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                 <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                 <p className="mt-6 text-gray-300 font-medium">Loading Dashboard...</p>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  
                  {/* Assigned Trainees */}
                  <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all group shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-gray-400 font-medium uppercase tracking-wider text-sm">Assigned Trainees</h3>
                      <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400">
                        <FaUserFriends className="text-xl" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold text-white mb-2 tracking-tight">{stats.assignedTrainees || 0}</div>
                    <div className="text-green-400 text-sm font-medium bg-green-500/10 px-3 py-1 rounded-full w-fit">+3 this week</div>
                  </div>

                  {/* Today's Sessions */}
                  <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all group shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-gray-400 font-medium uppercase tracking-wider text-sm">Today's Sessions</h3>
                      <div className="bg-purple-500/10 p-3 rounded-xl text-purple-400">
                        <FaCalendarCheck className="text-xl" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold text-white mb-2 tracking-tight">{stats.todaySessions || 0}</div>
                    <div className="text-blue-400 text-sm font-medium bg-blue-500/10 px-3 py-1 rounded-full w-fit">Next session upcoming</div>
                  </div>

                  {/* Workout Plans */}
                  <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-orange-500/30 transition-all group shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-gray-400 font-medium uppercase tracking-wider text-sm">Plans Created</h3>
                      <div className="bg-orange-500/10 p-3 rounded-xl text-orange-400">
                        <FaClipboardList className="text-xl" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold text-white mb-2 tracking-tight">{stats.plansCreated || 0}</div>
                    <div className="text-green-400 text-sm font-medium bg-green-500/10 px-3 py-1 rounded-full w-fit">5 New This Week</div>
                  </div>

                  {/* Rating */}
                  <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-yellow-500/30 transition-all group shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-gray-400 font-medium uppercase tracking-wider text-sm">Average Rating</h3>
                      <div className="bg-yellow-500/10 p-3 rounded-xl text-yellow-400">
                        <FaStar className="text-xl" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold text-white mb-2 tracking-tight">{stats.averageRating || 0}</div>
                    <div className="text-gray-400 text-sm font-medium">Based on recent reviews</div>
                  </div>

                </div>

                {/* Recent Workout Sessions List */}
                <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
                  <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                    <FaDumbbell className="text-blue-500" /> Recent Workout Sessions
                  </h3>
                  <div className="space-y-4">
                    
                    {/* --- FIX 2: Added '?.' to prevent crash if array is undefined --- */}
                    {stats.recentSessions?.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No recent sessions found.</div>
                    ) : (
                      stats.recentSessions?.map((session, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between bg-white/5 p-5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                          <div className="mb-2 md:mb-0">
                            <h4 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">{session.trainee_name}</h4>
                            <p className="text-gray-400 text-sm mt-1">{session.notes || 'General Workout Session'}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-2 md:mt-0">
                            <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 font-mono text-sm">
                                {session.session_time?.slice(0, 5) || '--:--'}
                            </div>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                              session.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              session.status === 'upcoming' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                              'bg-gray-700/50 text-gray-400 border-gray-600'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab === 'trainees' && <MyTraineesTab />} 
        {activeTab === 'plans' && <WorkoutPlansTab />}
        {activeTab === 'diet' && <DietPlansTab />}
        {activeTab === 'schedule' && <MyScheduleTab />}
        {activeTab === 'attendance' && <AttendanceTab />}
        {activeTab === 'progress' && <ProgressTab />}
        {activeTab === 'messages' && <MessagesTab />}


      </main>
    </div>
  )
}
