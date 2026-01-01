import React, { useState, useEffect } from 'react'
import { FaUser, FaPlus, FaWeight, FaRulerHorizontal, FaChartLine } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import api from '../../services/api'

export default function ProgressTab() {
  const [trainees, setTrainees] = useState([])
  const [selectedTrainee, setSelectedTrainee] = useState(null)
  const [progressData, setProgressData] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Form State
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    chest: '',
    waist: '',
    hips: ''
  })

  // 1. Fetch Trainee List on Load
  useEffect(() => {
    fetchTrainees()
  }, [])

  // 2. Fetch Progress when a Trainee is Selected
  useEffect(() => {
    if (selectedTrainee) {
      fetchProgress(selectedTrainee)
    }
  }, [selectedTrainee])

  const fetchTrainees = async () => {
    try {
      const res = await api.get('/trainer/attendance') 
      setTrainees(res.data)
      if (res.data.length > 0) setSelectedTrainee(res.data[0].trainee_id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async (tid) => {
    try {
      const res = await api.get(`/trainer/progress/${tid}`)
      const formatted = res.data.map(item => ({
        ...item,
        displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }))
      setProgressData(formatted)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddEntry = async (e) => {
    e.preventDefault()
    try {
      await api.post('/trainer/progress', { ...newEntry, traineeId: selectedTrainee })
      setShowModal(false)
      fetchProgress(selectedTrainee)
      setNewEntry({ date: new Date().toISOString().split('T')[0], weight: '', chest: '', waist: '', hips: '' })
    } catch (err) {
      alert("Failed to add progress entry")
    }
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in flex flex-col lg:flex-row gap-8 h-[85vh]">
      
      {/* --- LEFT: Student List (Glass Panel) --- */}
      <div className="w-full lg:w-80 bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col shadow-2xl">
        <h3 className="text-white font-bold mb-6 px-2 flex items-center gap-2">
          <FaUser className="text-blue-500" /> Select Student
        </h3>
        
        <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar flex-1">
          {trainees.map(t => (
            <div 
              key={t.trainee_id}
              onClick={() => setSelectedTrainee(t.trainee_id)}
              className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${
                selectedTrainee === t.trainee_id 
                  ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)]' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                selectedTrainee === t.trainee_id ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
              }`}>
                {t.name.charAt(0)}
              </div>
              <div>
                <p className={`font-bold text-sm ${selectedTrainee === t.trainee_id ? 'text-white' : 'text-gray-300'}`}>
                  {t.name}
                </p>
                <p className="text-xs text-gray-500 truncate w-32">Student</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RIGHT: Charts & Data (Glass Panel) --- */}
      <div className="flex-1 bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <FaChartLine className="text-purple-500" /> Progress Analytics
            </h2>
            <p className="text-gray-400 text-sm mt-1">Visualize growth and physical changes.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 hover:scale-105"
          >
            <FaPlus /> Log Data
          </button>
        </div>

        {/* Charts Container */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-8 relative z-10 custom-scrollbar">
          
          {progressData.length < 2 ? (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-black/20">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-600 text-2xl">
                <FaChartLine />
              </div>
              <p className="text-gray-400 font-medium">Not enough data to visualize.</p>
              <button onClick={() => setShowModal(true)} className="text-blue-400 font-bold mt-2 hover:text-blue-300">
                + Add first entry
              </button>
            </div>
          ) : (
            <>
              {/* Chart 1: Weight */}
              <div className="h-72 w-full bg-black/30 backdrop-blur-sm rounded-3xl p-6 border border-white/5 shadow-inner">
                <h4 className="text-blue-200 font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <FaWeight className="text-blue-500"/> Weight Trend (kg)
                </h4>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="displayDate" stroke="#666" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                      cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
                    />
                    <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Chart 2: Measurements */}
              <div className="h-72 w-full bg-black/30 backdrop-blur-sm rounded-3xl p-6 border border-white/5 shadow-inner">
                <h4 className="text-purple-200 font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <FaRulerHorizontal className="text-purple-500"/> Body Measurements (cm)
                </h4>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="displayDate" stroke="#666" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="chest" stroke="#a855f7" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="waist" stroke="#ec4899" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="hips" stroke="#eab308" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

        </div>
      </div>

      {/* --- GLASS MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            
            {/* Close Button */}
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

            <h2 className="text-2xl font-bold text-white mb-1">Log Measurements</h2>
            <p className="text-gray-400 text-sm mb-6">Update stats for the selected student.</p>

            <form onSubmit={handleAddEntry} className="space-y-5">
              
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Date</label>
                <input type="date" required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors"
                  value={newEntry.date} onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-900/10 p-3 rounded-xl border border-blue-500/20">
                  <label className="block text-blue-400 text-xs font-bold mb-1">Weight (kg)</label>
                  <input type="number" step="0.1" required className="w-full bg-transparent border-b border-blue-500/30 p-1 text-white font-mono text-lg focus:border-blue-500 outline-none"
                    value={newEntry.weight} onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})} placeholder="0.0" />
                </div>
                <div className="bg-purple-900/10 p-3 rounded-xl border border-purple-500/20">
                  <label className="block text-purple-400 text-xs font-bold mb-1">Chest (cm)</label>
                  <input type="number" step="0.1" className="w-full bg-transparent border-b border-purple-500/30 p-1 text-white font-mono text-lg focus:border-purple-500 outline-none"
                    value={newEntry.chest} onChange={(e) => setNewEntry({...newEntry, chest: e.target.value})} placeholder="0.0" />
                </div>
                <div className="bg-pink-900/10 p-3 rounded-xl border border-pink-500/20">
                  <label className="block text-pink-400 text-xs font-bold mb-1">Waist (cm)</label>
                  <input type="number" step="0.1" className="w-full bg-transparent border-b border-pink-500/30 p-1 text-white font-mono text-lg focus:border-pink-500 outline-none"
                    value={newEntry.waist} onChange={(e) => setNewEntry({...newEntry, waist: e.target.value})} placeholder="0.0" />
                </div>
                <div className="bg-yellow-900/10 p-3 rounded-xl border border-yellow-500/20">
                  <label className="block text-yellow-400 text-xs font-bold mb-1">Hips (cm)</label>
                  <input type="number" step="0.1" className="w-full bg-transparent border-b border-yellow-500/30 p-1 text-white font-mono text-lg focus:border-yellow-500 outline-none"
                    value={newEntry.hips} onChange={(e) => setNewEntry({...newEntry, hips: e.target.value})} placeholder="0.0" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl text-gray-400 font-bold hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/30 transition-all hover:scale-105">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
