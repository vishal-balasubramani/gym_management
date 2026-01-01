import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaUsers, FaDumbbell, FaMoneyBillWave, FaCalendarAlt, FaChartBar, FaWhatsapp, FaCog, FaSignOutAlt, FaTimes, 
  FaUserFriends, FaClipboardList, FaAppleAlt, FaCalendarCheck, FaChartLine, FaComments, FaThLarge,
  FaHome, FaCreditCard, FaCalendarPlus
} from 'react-icons/fa'

export default function Sidebar({ role, activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) {
  const navigate = useNavigate()

  // --- 1. Admin Menu Items ---
  const adminMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaThLarge /> },
    { id: 'members', label: 'Members', icon: <FaUsers /> },
    { id: 'trainers', label: 'Trainers', icon: <FaDumbbell /> },
    { id: 'payments', label: 'Payments', icon: <FaMoneyBillWave /> },
    { id: 'attendance', label: 'Attendance', icon: <FaCalendarAlt /> },
    { id: 'schedule', label: 'Schedule', icon: <FaCalendarCheck /> },
    { id: 'reports', label: 'Reports', icon: <FaChartBar /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <FaWhatsapp /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
  ]

  // --- 2. Trainer Menu Items ---
  const trainerMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaThLarge /> },
    { id: 'trainees', label: 'My Trainees', icon: <FaUserFriends /> },
    { id: 'plans', label: 'Workout Plans', icon: <FaClipboardList /> },
    { id: 'diet', label: 'Diet Plans', icon: <FaAppleAlt /> },
    { id: 'schedule', label: 'My Schedules', icon: <FaCalendarCheck /> },
    { id: 'attendance', label: 'Mark Attendance', icon: <FaCalendarAlt /> },
    { id: 'progress', label: 'Progress Tracking', icon: <FaChartLine /> },
    { id: 'messages', label: 'Messages', icon: <FaComments /> },
  ]

  // --- 3. Trainee Menu Items ---
  const traineeMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { id: 'workout', label: 'My Workout Plan', icon: <FaDumbbell /> },
    { id: 'diet', label: 'My Diet Plan', icon: <FaAppleAlt /> },
    { id: 'attendance', label: 'Attendance History', icon: <FaCalendarCheck /> },
    { id: 'payment', label: 'Payment', icon: <FaCreditCard /> },
    { id: 'progress', label: 'Progress Schedule', icon: <FaChartLine /> },
    { id: 'classes', label: 'Book Classes', icon: <FaCalendarPlus /> },
    { id: 'chat', label: 'Chat With Trainer', icon: <FaComments /> },
  ]

  const menuItems = role === 'admin' ? adminMenu : role === 'trainer' ? trainerMenu : traineeMenu

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/signin')
  }

  // Badge Styles (Blue for Admin, Purple for Trainer, Green/Cyan for Member)
  const getBadgeStyle = () => {
    if (role === 'admin') return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-900/20'
    if (role === 'trainer') return 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-purple-900/20'
    return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-cyan-900/20'
  }

  const getBadgeLabel = () => {
    if (role === 'admin') return 'Admin Panel'
    if (role === 'trainer') return 'Trainer Panel'
    return 'Member Panel'
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container - BLACK GLASS THEME */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 h-screen
        bg-black/80 backdrop-blur-2xl border-r border-white/10
        transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Subtle Inner Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none z-0"></div>

        <div className="flex flex-col h-full relative z-10">
          
          {/* 1. Header Area */}
          <div className="p-8 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">
                Fit<span className="text-blue-500">Hub</span>
              </h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mt-1">Gym Manager</p>
            </div>
            
            {/* Close Button (Mobile) */}
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="md:hidden text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* 2. Role Badge */}
          <div className="px-6 py-6">
            <div className={`text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl border text-center shadow-lg backdrop-blur-md transition-all ${getBadgeStyle()}`}>
              {getBadgeLabel()}
            </div>
          </div>

          {/* 3. Navigation Menu */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-2 pb-4 scrollbar-hide">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    if (window.innerWidth < 768 && setMobileMenuOpen) setMobileMenuOpen(false)
                  }}
                  className={`relative z-20 w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group text-left ${
                    isActive
                      ? 'bg-blue-600/10 text-white border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-r-full"></div>
                  )}

                  <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110 text-blue-400' : 'group-hover:scale-110 group-hover:text-gray-200'}`}>
                    {item.icon}
                  </span>
                  <span className={`font-medium tracking-wide text-sm ${isActive ? 'font-bold' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* 4. Logout Section */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <button
              onClick={handleLogout}
              className="relative z-20 w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 py-3.5 rounded-xl transition-all border border-red-500/20 hover:border-red-500/40 shadow-lg group"
            >
              <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm tracking-wide">Log Out</span>
            </button>
          </div>

        </div>
      </aside>
    </>
  )
}
