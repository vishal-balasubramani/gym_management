import React, { useState, useEffect } from 'react'
import { FaDumbbell, FaClock, FaRedo, FaCalendarAlt, FaFire, FaInfoCircle, FaRunning } from 'react-icons/fa'
import api from '../../services/api'

export default function TraineeWorkoutPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState('Monday') 

  useEffect(() => { fetchPlan() }, [])

  const fetchPlan = async () => {
    try {
      const res = await api.get('/trainee/my-plan')
      setPlan(res.data.plan)
    } catch (err) {
      console.error("Error fetching plan:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-900/40 rounded-3xl border border-white/5 shadow-2xl">
        <div className="p-6 bg-gray-800/50 rounded-full mb-6 text-gray-600">
          <FaDumbbell size={40} className="opacity-40" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2 uppercase tracking-wide">No Active Routine</h3>
        <p className="text-gray-400 text-center max-w-sm px-6">
          Your training protocol hasn't been assigned yet. Stay ready!
        </p>
      </div>
    )
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="animate-fade-in space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* --- TOP HEADER CARD --- */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-indigo-900/20 border border-white/10 p-8 rounded-[2rem] shadow-2xl">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em]">
              <FaRunning size={12}/> Training Protocol
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight uppercase">{plan.name}</h2>
            <div className="flex items-center gap-2 text-gray-300 font-medium">
              <FaFire className="text-orange-500" /> Goal: {plan.goal}
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-inner">
            <FaCalendarAlt className="text-blue-500 text-xl" />
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Valid Until</p>
              <p className="text-white font-semibold">
                {new Date(plan.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT SECTION --- */}
      {!plan.schedule ? (
        /* FALLBACK: High-level Description */
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-6 text-blue-500">
            <FaInfoCircle size={18} />
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">Trainer's Overview</h3>
          </div>
          <div className="bg-black/30 p-8 rounded-2xl border border-white/5 leading-relaxed italic text-gray-300 text-lg">
            {plan.description || "Follow your trainer's specific verbal instructions. Daily exercise logging is pending."}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Days Navigation Tabs */}
          <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide">
            {days.map(day => {
              const hasWorkout = plan.schedule[day] && plan.schedule[day].length > 0
              const isActive = activeDay === day
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-8 py-3 rounded-2xl font-semibold text-sm transition-all border whitespace-nowrap ${
                    isActive 
                      ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/40 scale-105' 
                      : 'bg-gray-900/60 text-gray-400 border-white/5 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{day}</span>
                    {hasWorkout && <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-white' : 'bg-blue-500'}`}></div>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Exercises Grid  */}
          <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 min-h-[400px]">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
               <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                 {activeDay}'s Routine
               </h3>
               <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase">
                 {plan.schedule[activeDay]?.length || 0} Exercises
               </span>
            </div>

            {!plan.schedule[activeDay] || plan.schedule[activeDay].length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-4">
                <div className="bg-white/5 p-5 rounded-full">
                  <FaClock size={32} className="opacity-20" />
                </div>
                <p className="italic">Recovery Day. Focus on active rest and stretching.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {plan.schedule[activeDay].map((ex, idx) => (
                  <div key={idx} className="group bg-black/40 border border-white/5 p-6 rounded-2xl hover:border-blue-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                        {ex.exercise_name}
                      </h4>
                      <div className="bg-blue-500/10 p-2 rounded-lg">
                        <FaDumbbell className="text-blue-500" />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <div className="bg-gray-800/50 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/5">
                        <FaRedo className="text-blue-400 text-xs" />
                        <span className="text-sm font-medium text-gray-200">{ex.sets} Sets</span>
                      </div>
                      <div className="bg-gray-800/50 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/5">
                        <span className="text-sm font-medium text-gray-200">{ex.reps} Reps</span>
                      </div>
                      {ex.duration_minutes && (
                        <div className="bg-gray-800/50 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/5">
                          <FaClock className="text-orange-400 text-xs" />
                          <span className="text-sm font-medium text-gray-200">{ex.duration_minutes} min</span>
                        </div>
                      )}
                    </div>

                    {ex.notes && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-gray-500 leading-relaxed italic">
                          " {ex.notes} "
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}