import { useState, useEffect } from 'react'
import { FaUsers, FaDumbbell, FaMoneyBillWave, FaUserPlus, FaChartLine, FaCalendarCheck } from 'react-icons/fa'
import api from '../services/api'

// --- Components ---
import Sidebar from '../componenets/Sidebar'
import MembersTab from '../componenets/admin/MembersTab'
import TrainersTab from '../componenets/admin/TrainerTab'
import PaymentsTab from '../componenets/admin/PaymentsTab'
import AttendanceTab from '../componenets/admin/AttendanceTab'
import ClassScheduleTab from '../componenets/admin/ClassScheduleTab'
import ReportsTab from '../componenets/admin/ReportsTab'
import WhatsAppTab from '../componenets/admin/WhatsAppTab'
import SettingsTab from '../componenets/admin/SettingsTab'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  // Ensure default state matches the keys sent by getDashboardStats in the backend
  const [stats, setStats] = useState({
    totalMembers: 0, 
    activeTrainers: 0, 
    monthlyRevenue: 0,
    newMembers: 0, 
    todayAttendance: 0, 
    activeMemberships: 0
  })

  useEffect(() => {
    if (activeTab === 'dashboard') fetchDashboardStats()
  }, [activeTab])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/dashboard-stats')
      
      // Verification: The backend sends { success: true, stats: { ... } }
      if (response.data && response.data.stats) {
        setStats(response.data.stats)
      }
    } catch (error) { 
      console.error('Frontend Fetch Error:', error) 
    } finally { 
      setLoading(false) 
    }
  }

  // Calculate percentage safely
  const activePercentage = stats.totalMembers > 0 
    ? Math.round(((stats.activeMemberships || 0) / stats.totalMembers) * 100) 
    : 0

  return (
    <div className="min-h-screen flex relative bg-black">
      {/* Background Image Container */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://i.shgcdn.com/d61f124a-5eb2-41c7-abd1-ace0dd6f7d97/-/format/auto/-/preview/3000x3000/-/quality/lighter/" 
          alt="Gym Background" 
          className="w-full h-full object-cover opacity-30" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
      </div>

      {/* Sidebar - Positioned correctly */}
      <div className="relative z-20">
        <Sidebar role="admin" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <main className="relative z-10 flex-1 ml-64 p-8 overflow-y-auto h-screen text-white">
        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 flex justify-between items-center shadow-xl">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Dashboard Overview</h1>
                <p className="text-blue-400 font-medium">System operational • Admin Access</p>
              </div>
              <div className="text-right hidden md:block border-l border-white/10 pl-8">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-1 font-bold">Current Date</p>
                <p className="text-white font-mono text-xl">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>

            {loading ? (
               <div className="flex flex-col items-center justify-center py-20">
                 <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                 <p className="mt-6 text-gray-400 animate-pulse">Syncing with database...</p>
               </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Revenue Card (₹ symbol handled) */}
                  <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Monthly Revenue</p>
                        <h3 className="text-3xl font-bold text-white">₹{(stats.monthlyRevenue || 0).toLocaleString()}</h3>
                      </div>
                      <div className="bg-green-500/20 p-3 rounded-xl text-green-400 text-2xl group-hover:scale-110 transition-transform"><FaMoneyBillWave /></div>
                    </div>
                    <p className="mt-4 text-xs text-green-400 font-medium">Settled success payments</p>
                  </div>

                  {/* Members Card */}
                  <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Total Members</p>
                        <h3 className="text-3xl font-bold text-white">{stats.totalMembers || 0}</h3>
                      </div>
                      <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400 text-2xl group-hover:scale-110 transition-transform"><FaUsers /></div>
                    </div>
                    <p className="mt-4 text-xs text-blue-300">+{stats.newMembers || 0} joined recently</p>
                  </div>

                  {/* Attendance Card */}
                  <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Today's Attendance</p>
                        <h3 className="text-3xl font-bold text-white">{stats.todayAttendance || 0}</h3>
                      </div>
                      <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400 text-2xl group-hover:scale-110 transition-transform"><FaCalendarCheck /></div>
                    </div>
                    <p className="mt-4 text-xs text-purple-300">Active sessions today</p>
                  </div>

                  {/* Trainers Card */}
                  <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Active Trainers</p>
                        <h3 className="text-3xl font-bold text-white">{stats.activeTrainers || 0}</h3>
                      </div>
                      <div className="bg-orange-500/20 p-3 rounded-xl text-orange-400 text-2xl group-hover:scale-110 transition-transform"><FaDumbbell /></div>
                    </div>
                    <p className="mt-4 text-xs text-orange-300">Staff registered</p>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-lg mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold">Membership Penetration</h3>
                      <p className="text-sm text-gray-400">Ratio of registered members to active paid plans</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-pink-500">{activePercentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-1000 ease-out" 
                      style={{ width: `${activePercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-gray-500 font-medium">
                    <span>{stats.activeMemberships || 0} Active Plans</span>
                    <span>Target: 100%</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                    Quick Management
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Add Member', icon: <FaUserPlus />, action: () => setActiveTab('members'), color: 'text-blue-400', bg: 'bg-blue-500/10' },
                      { label: 'View Payments', icon: <FaMoneyBillWave />, action: () => setActiveTab('payments'), color: 'text-green-400', bg: 'bg-green-500/10' },
                      { label: 'Log Attendance', icon: <FaCalendarCheck />, action: () => setActiveTab('attendance'), color: 'text-purple-400', bg: 'bg-purple-500/10' },
                      { label: 'Manage Trainers', icon: <FaDumbbell />, action: () => setActiveTab('trainers'), color: 'text-orange-400', bg: 'bg-orange-500/10' },
                    ].map((btn, idx) => (
                      <button key={idx} onClick={btn.action} className="group flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 p-8 rounded-2xl transition-all duration-300">
                        <div className={`${btn.bg} p-4 rounded-2xl ${btn.color} text-3xl group-hover:scale-110 transition-transform`}>{btn.icon}</div>
                        <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab Routing Logic */}
        {activeTab === 'members' && <MembersTab />}
        {activeTab === 'trainers' && <TrainersTab />}
        {activeTab === 'payments' && <PaymentsTab />}
        {activeTab === 'attendance' && <AttendanceTab />}
        {activeTab === 'schedule' && <ClassScheduleTab />}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'whatsapp' && <WhatsAppTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  )
}