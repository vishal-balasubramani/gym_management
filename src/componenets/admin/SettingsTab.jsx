import { useState } from 'react'
import { FaSave, FaLock, FaUserCog, FaBuilding, FaCamera, FaChevronRight } from 'react-icons/fa'

export default function SettingsTab() {
  const [activeSection, setActiveSection] = useState('gym-info')
  const [loading, setLoading] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('✅ Settings saved successfully!')
    }, 1000)
  }

  const menuItems = [
    { id: 'gym-info', label: 'Gym Details', icon: <FaBuilding />, desc: 'Name, Contact, Address' },
    { id: 'profile', label: 'Admin Profile', icon: <FaUserCog />, desc: 'Personal details, Avatar' },
    { id: 'security', label: 'Security', icon: <FaLock />, desc: 'Password, Authentication' },
  ]

  return (
    <div className="max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      {/* --- UNIFIED CARD LAYOUT --- */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        
        {/* ==================== LEFT SIDEBAR (Full Height) ==================== */}
        <div className="w-full md:w-72 bg-black/20 border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Preferences</h3>
          </div>
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl text-left transition-all duration-200 group ${
                  activeSection === item.id
                    ? 'bg-white/10 text-white shadow-sm border border-white/10'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${activeSection === item.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'}`}>
                    {item.icon}
                  </span>
                  <div>
                    <span className="block font-medium text-sm">{item.label}</span>
                  </div>
                </div>
                {activeSection === item.id && <FaChevronRight className="text-xs text-blue-400" />}
              </button>
            ))}
          </nav>
        </div>

        {/* ==================== RIGHT CONTENT AREA ==================== */}
        <div className="flex-1 bg-transparent p-8 md:p-10 overflow-y-auto">
          
          {/* --- Gym Info --- */}
          {activeSection === 'gym-info' && (
            <div className="animate-fade-in max-w-3xl">
              <div className="mb-8 pb-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white mb-2">Gym Information</h2>
                <p className="text-gray-400">Manage your facility's public-facing details.</p>
              </div>
              
              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Gym Name</label>
                    <input 
                      type="text" 
                      defaultValue="Iron Fitness Hub" 
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all placeholder-gray-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Contact Phone</label>
                    <input 
                      type="text" 
                      defaultValue="+91 98765 43210" 
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all placeholder-gray-500" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Full Address</label>
                  <textarea 
                    rows="3" 
                    defaultValue="123, Anna Salai, Chennai, Tamil Nadu - 600002" 
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all placeholder-gray-500"
                  ></textarea>
                </div>

                <div className="pt-6 flex items-center justify-end border-t border-white/10">
                  <button className="px-6 py-2 text-gray-400 hover:text-white font-medium mr-4 transition-colors">Cancel</button>
                  <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- Admin Profile --- */}
          {activeSection === 'profile' && (
            <div className="animate-fade-in max-w-3xl">
              <div className="mb-8 pb-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white mb-2">Admin Profile</h2>
                <p className="text-gray-400">Update your personal account details and avatar.</p>
              </div>

              <div className="flex items-center gap-6 mb-10">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white ring-4 ring-black/50 shadow-xl border border-white/20">AD</div>
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm border border-white/20">
                    <FaCamera className="text-white text-xl" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">Admin User</h3>
                  <p className="text-gray-400 text-sm">Super Administrator</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Display Name</label>
                    <input 
                      type="text" 
                      defaultValue="Admin User" 
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all placeholder-gray-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="admin@gym.com" 
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all placeholder-gray-500" 
                    />
                  </div>
                </div>
                <div className="pt-6 flex items-center justify-end border-t border-white/10">
                   <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all">
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- Security --- */}
          {activeSection === 'security' && (
            <div className="animate-fade-in max-w-2xl">
              <div className="mb-8 pb-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white mb-2">Security</h2>
                <p className="text-gray-400">Ensure your account stays safe with a strong password.</p>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-red-500 outline-none transition-all placeholder-gray-500" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-red-500 outline-none transition-all placeholder-gray-500" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-red-500 outline-none transition-all placeholder-gray-500" 
                  />
                </div>

                <div className="pt-6 flex items-center justify-end border-t border-white/10">
                   <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-red-500/20 transition-all">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
