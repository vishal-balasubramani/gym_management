import { useState, useEffect } from 'react'
import api from '../../services/api'
import { FaChartLine, FaUsers, FaDownload, FaCoins, FaUserTimes, FaUserCheck } from 'react-icons/fa'

export default function ReportsTab() {
  const [revenueData, setRevenueData] = useState([])
  const [membershipData, setMembershipData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date()
        const lastMonth = new Date(new Date().setDate(today.getDate() - 30))
        
        const [revRes, memRes] = await Promise.all([
          api.get(`/admin/reports/revenue?startDate=${lastMonth.toISOString().split('T')[0]}&endDate=${today.toISOString().split('T')[0]}`),
          api.get('/admin/reports/membership')
        ])
        
        setRevenueData(revRes.data.report || [])
        setMembershipData(memRes.data.report || [])
      } catch (error) {
        console.error('Error loading reports:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Helper for max value to scale charts
  const maxRevenue = Math.max(...revenueData.map(d => parseFloat(d.total_revenue)), 1000)
  const totalActive = membershipData.reduce((acc, curr) => acc + parseInt(curr.active_members || 0), 0)
  const totalExpired = membershipData.reduce((acc, curr) => acc + parseInt(curr.expired_members || 0), 0)
  const avgRevenue = revenueData.length ? (revenueData.reduce((acc, curr) => acc + parseFloat(curr.total_revenue), 0) / revenueData.length).toFixed(0) : 0

  return (
    <div className="space-y-8 pb-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white mb-1">Reports & Analysis</h1>
           <p className="text-gray-400">Financial insights and membership statistics.</p>
        </div>
        <button className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 border border-white/10 shadow-lg transition-all font-medium">
          <FaDownload /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-gray-300 font-medium">Analyzing data...</p>
        </div>
      ) : (
        <>
          {/* Revenue Chart Section */}
          <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                <FaChartLine />
              </div>
              Revenue Trend (Last 30 Days)
            </h2>
            
            <div className="h-64 flex items-end justify-between gap-2 border-b border-white/10 pb-2">
              {revenueData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No revenue data recorded for this period
                </div>
              ) : revenueData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg pointer-events-none transition-all transform translate-y-2 group-hover:translate-y-0 shadow-xl border border-white/10 whitespace-nowrap z-10">
                    <span className="font-bold text-green-400">₹{parseFloat(item.total_revenue).toLocaleString()}</span>
                    <span className="block text-gray-400 text-[10px]">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-full bg-green-500/20 hover:bg-green-500/60 rounded-t-sm transition-all duration-500 relative group-hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    style={{ height: `${Math.max((item.total_revenue / maxRevenue) * 100, 2)}%` }} // Min height 2% for visibility
                  ></div>
                  
                  {/* Label (Only show some labels to prevent overcrowding if needed, or rotate) */}
                  <span className="text-[9px] text-gray-500 mt-3 rotate-45 origin-left w-4 overflow-visible whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Membership Distribution */}
            <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                  <FaUsers />
                </div>
                Membership Distribution
              </h2>
              <div className="space-y-6">
                {membershipData.map((plan, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300 uppercase font-bold tracking-wider text-xs">{plan.plan_type}</span>
                      <span className="text-white font-bold">{plan.total_members} Members</span>
                    </div>
                    <div className="w-full bg-black/40 border border-white/5 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full shadow-lg ${
                            plan.plan_type === 'elite' ? 'bg-purple-500' : 
                            plan.plan_type === 'pro' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(plan.total_members / Math.max(...membershipData.map(m => m.total_members), 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {membershipData.length === 0 && <p className="text-gray-500 text-center py-4">No membership data available.</p>}
              </div>
            </div>

            {/* Key Insights Cards */}
            <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl flex flex-col justify-between">
               <h2 className="text-xl font-bold text-white mb-6">Key Insights</h2>
               
               <div className="space-y-4">
                 
                 {/* Active Members Card */}
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-500/10 p-3 rounded-full text-green-400 group-hover:bg-green-500/20 transition-colors"><FaUserCheck /></div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase">Active Members</p>
                            <p className="text-white text-lg font-bold">Currently Active</p>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-green-400">{totalActive}</span>
                 </div>

                 {/* Expired Members Card */}
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-red-500/30 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-500/10 p-3 rounded-full text-red-400 group-hover:bg-red-500/20 transition-colors"><FaUserTimes /></div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase">Churn</p>
                            <p className="text-white text-lg font-bold">Expired Members</p>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-red-400">{totalExpired}</span>
                 </div>

                 {/* Avg Revenue Card */}
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-yellow-500/30 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-500/10 p-3 rounded-full text-yellow-400 group-hover:bg-yellow-500/20 transition-colors"><FaCoins /></div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase">Performance</p>
                            <p className="text-white text-lg font-bold">Avg. Daily Revenue</p>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-yellow-400">₹{parseInt(avgRevenue).toLocaleString()}</span>
                 </div>

               </div>
            </div>

          </div>
        </>
      )}
    </div>
  )
}
