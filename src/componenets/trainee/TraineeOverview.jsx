import React from 'react'
import { FaWeight, FaRulerVertical, FaRunning, FaCheckCircle, FaClock } from 'react-icons/fa'

export default function TraineeOverview({ stats }) {
  if (!stats) return null;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Weight */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-blue-500/30 transition-all shadow-lg group">
           <div className="flex justify-between items-start mb-4">
             <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider">Current Weight</h3>
             <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><FaWeight size={20} /></div>
           </div>
           <p className="text-4xl font-black text-white mb-2">{stats.weight}</p>
           <p className="text-green-400 text-sm font-bold bg-green-500/10 px-3 py-1 rounded-full w-fit border border-green-500/20">{stats.weightChange}</p>
        </div>

        {/* Card 2: BMI */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-purple-500/30 transition-all shadow-lg group">
           <div className="flex justify-between items-start mb-4">
             <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider">BMI Score</h3>
             <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><FaRulerVertical size={20} /></div>
           </div>
           <p className="text-4xl font-black text-white mb-2">{stats.bmi}</p>
           <p className="text-purple-400 text-sm font-bold bg-purple-500/10 px-3 py-1 rounded-full w-fit border border-purple-500/20">{stats.bmiStatus}</p>
        </div>

        {/* Card 3: Workouts */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-orange-500/30 transition-all shadow-lg group">
           <div className="flex justify-between items-start mb-4">
             <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider">Workouts</h3>
             <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400"><FaRunning size={20} /></div>
           </div>
           <div className="flex items-end gap-2 mb-4">
              <p className="text-4xl font-black text-white">{stats.workouts}</p>
              <p className="text-gray-500 font-bold mb-2">/ {stats.workoutGoal}</p>
           </div>
           <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-white/5">
             <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min((stats.workouts/stats.workoutGoal)*100, 100)}%` }}></div>
           </div>
        </div>

        {/* Card 4: Status */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-green-500/30 transition-all shadow-lg group">
           <div className="flex justify-between items-start mb-4">
             <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider">Status</h3>
             <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><FaCheckCircle size={20} /></div>
           </div>
           <p className="text-3xl font-black text-white mb-2 uppercase">{stats.status}</p>
           <p className="text-green-400 text-sm font-bold bg-green-500/10 px-3 py-1 rounded-full w-fit border border-green-500/20">{stats.expiry}</p>
        </div>

      </div>

      {/* Recent Sessions */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
          <FaClock className="text-blue-500" /> Recent Activity
        </h3>

        <div className="space-y-4">
          {stats.recentSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity found.</p>
          ) : (
            stats.recentSessions.map((session, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-white/5 transition-all">
                <div>
                  <p className="text-white font-bold text-lg">{session.title}</p>
                  <p className="text-gray-400 text-sm font-medium mt-1">{session.time}</p>
                </div>
                <span className={`mt-3 md:mt-0 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${
                  session.type === 'upcoming' 
                    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                }`}>
                  {session.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
