import React, { useState, useEffect } from 'react'
import { FaWeight, FaRulerVertical, FaBullseye, FaEnvelope, FaPhoneAlt, FaUserCircle } from 'react-icons/fa'
import api from '../../services/api'

export default function MyTraineesTab() {
  const [activeTrainees, setActiveTrainees] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTrainees = async () => {
    try {
      setLoading(true)
      const res = await api.get('/trainer/trainees')
      setActiveTrainees(res.data.activeTrainees || [])
    } catch (err) {
      console.error("Error fetching trainees:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrainees()
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading student details...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Active Trainees</h2>
        <div className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
           {activeTrainees.length} Assigned
        </div>
      </div>

      {activeTrainees.length === 0 ? (
        <div className="bg-gray-900/40 border border-white/5 border-dashed rounded-2xl p-16 text-center">
           <FaUserCircle className="mx-auto text-4xl text-gray-700 mb-3" />
           <p className="text-gray-500 text-sm">No trainees currently have a booked session with you.</p>
        </div>
      ) : (
        // CHANGED: Increased to lg:grid-cols-3 and reduced gap
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeTrainees.map((trainee) => (
            // CHANGED: Reduced padding (p-5), rounded corners (rounded-2xl)
            <div key={trainee.id} className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg group transition-all hover:border-blue-500/30 hover:-translate-y-1">
              
              {/* Profile Section - CHANGED: Reduced avatar size, font size, and margins */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xl font-black text-white shadow-md">
                  {trainee.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{trainee.name}</h3>
                  <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-[0.15em] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {trainee.plan_type || 'Standard'}
                  </span>
                </div>
              </div>

              {/* Physical Metrics Row - CHANGED: Reduced gaps, padding, and font sizes */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                  <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <FaWeight className="text-blue-500" size={10} /> Weight
                  </p>
                  <p className="text-xl font-black text-white">
                    {trainee.current_weight ? `${trainee.current_weight}` : '--'} <span className="text-xs text-gray-500 font-bold">kg</span>
                  </p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                  <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <FaRulerVertical className="text-blue-500" size={10} /> Height
                  </p>
                  <p className="text-xl font-black text-white">
                    {trainee.height ? `${trainee.height}` : '--'} <span className="text-xs text-gray-500 font-bold">cm</span>
                  </p>
                </div>
              </div>

              {/* Goal Section - CHANGED: Reduced padding, icon size, and text size */}
              <div className="mb-5">
                <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-2">Fitness Goal</p>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                  <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500">
                    <FaBullseye size={14} />
                  </div>
                  <span className="text-gray-200 font-bold text-sm truncate">{trainee.fitness_goal || 'General Fitness'}</span>
                </div>
              </div>

              {/* Actions - CHANGED: Reduced button padding and font size */}
              <div className="grid grid-cols-2 gap-3">
                <a href={`mailto:${trainee.email}`} className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <FaEnvelope size={12} /> Email
                </a>
                <a href={`tel:${trainee.phone}`} className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <FaPhoneAlt size={12} /> Call
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}