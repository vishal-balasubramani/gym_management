import React, { useState, useEffect } from 'react'
import { FaAppleAlt, FaFire, FaInfoCircle, FaCalendarAlt, FaBullseye, FaChartPie } from 'react-icons/fa'
import api from '../../services/api'

export default function TraineeDietPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDiet = async () => {
      try {
        const res = await api.get('/trainee/my-diet')
        setPlan(res.data.plan)
      } catch (err) { 
        console.error("Fetch Error:", err) 
      } finally { 
        setLoading(false) 
      }
    }
    fetchDiet()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>
  )

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-900/40 rounded-3xl border border-white/5 shadow-2xl">
        <div className="p-6 bg-gray-800/50 rounded-full mb-6">
          <FaAppleAlt className="text-gray-600 text-5xl opacity-40" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2 uppercase tracking-wide">No Active Diet</h3>
        <p className="text-gray-400 text-center max-w-sm px-6">
          Your personalized nutrition protocol hasn't been assigned yet. Stay tuned!
        </p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* --- TOP HEADER CARD --- */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600/20 to-emerald-900/20 border border-white/10 p-8 rounded-[2rem] shadow-2xl">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-[0.2em]">
              <FaBullseye size={12}/> Current Mission
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">{plan.title}</h2>
            <p className="text-gray-300 font-medium text-lg italic opacity-80">{plan.goal}</p>
          </div>

          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-8 py-5 rounded-2xl border border-white/10 shadow-inner">
            <div className="bg-orange-500/20 p-3 rounded-xl">
              <FaFire className="text-orange-500 text-2xl animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Daily Target</p>
              <p className="text-3xl font-black text-white leading-none">
                {plan.calories} <span className="text-xs font-bold text-green-500 uppercase ml-1">kcal</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MACROS & INSTRUCTIONS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Macros Breakdown */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl h-full flex flex-col justify-between">
            <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest mb-6">
              <FaChartPie size={12}/> Macro Breakdown
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between group">
                <span className="text-gray-400 text-sm font-medium">Protein</span>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold text-blue-400 leading-none">{plan.protein}</span>
                  <span className="text-[10px] text-gray-600 font-bold mb-1">G</span>
                </div>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>

              <div className="flex items-center justify-between group">
                <span className="text-gray-400 text-sm font-medium">Carbohydrates</span>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold text-yellow-400 leading-none">{plan.carbs}</span>
                  <span className="text-[10px] text-gray-600 font-bold mb-1">G</span>
                </div>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full rounded-full" style={{ width: '60%' }}></div>
              </div>

              <div className="flex items-center justify-between group">
                <span className="text-gray-400 text-sm font-medium">Healthy Fats</span>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold text-red-400 leading-none">{plan.fats}</span>
                  <span className="text-[10px] text-gray-600 font-bold mb-1">G</span>
                </div>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-400 h-full rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl h-full">
            <div className="flex items-center gap-3 mb-6 text-green-500">
              <FaInfoCircle size={18} />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Trainer's Protocol</h3>
            </div>
            
            <div className="relative bg-black/30 p-6 rounded-2xl border border-white/5 min-h-[160px]">
              <p className="text-gray-300 text-lg font-normal leading-relaxed whitespace-pre-wrap italic">
                {plan.description || "Focus on nutrient-dense foods and stay hydrated. Reach out to your trainer if you need adjustments."}
              </p>
              <div className="absolute bottom-4 right-4 opacity-5 pointer-events-none">
                <FaAppleAlt size={80} />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-600">
               <div className="flex items-center gap-2">
                 <FaCalendarAlt size={12} className="text-green-500/50" />
                 Status: <span className="text-green-500">Active Protocol</span>
               </div>
               {plan.end_date && (
                 <span>Expires: {new Date(plan.end_date).toLocaleDateString()}</span>
               )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}