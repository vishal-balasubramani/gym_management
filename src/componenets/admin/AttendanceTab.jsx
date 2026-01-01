import { useState, useEffect } from 'react'
import { FaCalendarAlt, FaCheckCircle, FaUserClock } from 'react-icons/fa'
import api from '../../services/api'

export default function AttendanceTab() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]) // Default to today

  useEffect(() => {
    fetchAttendance()
  }, [dateFilter])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      // Pass startDate and endDate to backend
      const response = await api.get(`/admin/attendance?startDate=${dateFilter}&endDate=${dateFilter}`)
      setAttendance(response.data.attendance || [])
    } catch (error) {
      console.error('Error fetching attendance:', error)
      setAttendance([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats for the selected date
  const presentCount = attendance.length
  const activeNowCount = attendance.filter(a => !a.check_out_time).length
  const completedCount = attendance.filter(a => a.check_out_time).length

  return (
    <div>
      {/* --- Header & Filter --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Attendance Monitor</h1>
          <p className="text-gray-400">View daily member check-ins recorded by trainers.</p>
        </div>
        
        {/* Date Picker - Glass Style */}
        <div className="bg-gray-900/60 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center gap-3 shadow-lg">
           <span className="text-gray-400 text-sm pl-2 font-medium">Select Date:</span>
           <input
             type="date"
             value={dateFilter}
             onChange={(e) => setDateFilter(e.target.value)}
             className="bg-black/40 border border-white/10 text-white px-4 py-2 rounded-lg outline-none focus:border-blue-500 transition-colors"
           />
        </div>
      </div>

      {/* --- Stats Row --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         {/* Total Present */}
         <div className="bg-gray-900/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg flex items-center justify-between hover:border-blue-500/30 transition-all">
            <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Present</p>
                <h3 className="text-3xl font-bold text-white mt-1">{presentCount}</h3>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-full text-blue-400 border border-blue-500/20">
                <FaCheckCircle size={24} />
            </div>
         </div>

         {/* Currently Active */}
         <div className="bg-gray-900/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg flex items-center justify-between hover:border-green-500/30 transition-all">
            <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active Now</p>
                <h3 className="text-3xl font-bold text-green-400 mt-1">{activeNowCount}</h3>
            </div>
            <div className="p-4 bg-green-500/10 rounded-full text-green-400 border border-green-500/20 animate-pulse">
                <FaUserClock size={24} />
            </div>
         </div>

         {/* Completed */}
         <div className="bg-gray-900/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg flex items-center justify-between hover:border-gray-500/30 transition-all">
            <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Finished</p>
                <h3 className="text-3xl font-bold text-gray-300 mt-1">{completedCount}</h3>
            </div>
            <div className="p-4 bg-white/5 rounded-full text-gray-400 border border-white/10">
                <FaCheckCircle size={24} />
            </div>
         </div>
      </div>

      {/* --- Table --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Loading attendance logs...</p>
        </div>
      ) : attendance.length === 0 ? (
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center shadow-xl">
           <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 border border-white/10">
             <FaCalendarAlt size={24} />
           </div>
           <h3 className="text-white text-xl font-bold mb-2">No records found</h3>
           <p className="text-gray-500">No attendance was marked for this date.</p>
        </div>
      ) : (
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold uppercase text-xs tracking-wider">Member Details</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold uppercase text-xs tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold uppercase text-xs tracking-wider">Check In</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold uppercase text-xs tracking-wider">Check Out</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold uppercase text-xs tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {attendance.map((record) => (
                  <tr key={record.id} className="hover:bg-white/5 transition-colors">
                    
                    {/* Member Details */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{record.name}</div>
                      <div className="text-xs text-gray-400">{record.email}</div>
                    </td>
                    
                    {/* Date */}
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    
                    {/* Check In */}
                    <td className="px-6 py-4">
                      <span className="text-green-400 font-mono bg-green-500/10 border border-green-500/20 px-2 py-1 rounded text-sm">
                        {record.check_in_time ? record.check_in_time.slice(0, 5) : '--:--'}
                      </span>
                    </td>
                    
                    {/* Check Out */}
                    <td className="px-6 py-4">
                      <span className={`font-mono px-2 py-1 rounded text-sm border ${
                        record.check_out_time 
                          ? 'text-red-400 bg-red-500/10 border-red-500/20' 
                          : 'text-gray-500 bg-white/5 border-transparent'
                      }`}>
                        {record.check_out_time ? record.check_out_time.slice(0, 5) : '--:--'}
                      </span>
                    </td>
                    
                    {/* Status Badge */}
                    <td className="px-6 py-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                         record.check_out_time 
                           ? 'bg-gray-700/50 text-gray-400 border-gray-600' 
                           : 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                       }`}>
                         {record.check_out_time ? 'Checked Out' : 'Active Now'}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
