import React, { useState, useEffect } from 'react'
import { FaPlus, FaTrash, FaAppleAlt, FaLeaf, FaUtensils, FaTimes, FaUserAlt, FaCalendarAlt } from 'react-icons/fa'
import api from '../../services/api'

export default function DietPlansTab() {
  const [plans, setPlans] = useState([])
  const [trainees, setTrainees] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  const [newPlan, setNewPlan] = useState({
    trainee_id: '',
    title: '',
    goal: 'Weight Loss',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    description: '',
    end_date: ''
  })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [plansRes, traineesRes] = await Promise.all([
        api.get('/trainer/diet-plans'),
        api.get('/trainer/trainees')
      ])
      setPlans(plansRes.data || [])
      setTrainees(traineesRes.data.activeTrainees || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newPlan.trainee_id) return alert("Ensure a student is selected.")
    try {
      await api.post('/trainer/diet-plans', newPlan)
      setIsCreating(false)
      setNewPlan({ trainee_id: '', title: '', goal: 'Weight Loss', calories: '', protein: '', carbs: '', fats: '', description: '', end_date: '' })
      fetchData()
    } catch (err) { alert("Failed to save plan. Check if database columns were added.") }
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Diet & Nutrition</h2>
          <p className="text-gray-400 text-sm">Assign nutrition strategies to your session trainees.</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            <FaPlus /> Create Diet Plan
          </button>
        )}
      </div>

      {/* --- INLINE GLASS FORM --- */}
      {isCreating && (
        <div className="bg-gray-900/60 backdrop-blur-md border border-green-500/30 rounded-2xl p-8 mb-8 shadow-2xl relative animate-slide-down">
          <button onClick={() => setIsCreating(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><FaTimes size={20}/></button>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><FaUtensils className="text-green-500" /> New Nutrition Strategy</h3>
          
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Assign To Trainee</label>
                <select required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-green-500 outline-none"
                  value={newPlan.trainee_id} onChange={(e) => setNewPlan({...newPlan, trainee_id: e.target.value})}>
                  <option value="">Select a student...</option>
                  {trainees.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Plan Title</label>
                <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-green-500" 
                  placeholder="e.g. Ketogenic Weight Loss" value={newPlan.title} onChange={(e) => setNewPlan({...newPlan, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Daily Calories</label>
                <input type="number" required placeholder="2500" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white" 
                  value={newPlan.calories} onChange={(e) => setNewPlan({...newPlan, calories: e.target.value})} />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Goal</label>
                <select className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white" value={newPlan.goal} onChange={(e) => setNewPlan({...newPlan, goal: e.target.value})}>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">End Date</label>
                <input type="date" required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white" 
                  value={newPlan.end_date} onChange={(e) => setNewPlan({...newPlan, end_date: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
               <input type="number" required placeholder="Protein (g)" className="bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white" 
                value={newPlan.protein} onChange={(e) => setNewPlan({...newPlan, protein: e.target.value})} />
               <input type="number" required placeholder="Carbs (g)" className="bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white" 
                value={newPlan.carbs} onChange={(e) => setNewPlan({...newPlan, carbs: e.target.value})} />
               <input type="number" required placeholder="Fats (g)" className="bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white" 
                value={newPlan.fats} onChange={(e) => setNewPlan({...newPlan, fats: e.target.value})} />
            </div>

            <textarea required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white h-24 focus:border-green-500 outline-none" 
              placeholder="Include meal timings and food items..." value={newPlan.description} onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}></textarea>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 text-gray-400 hover:text-white font-bold">Cancel</button>
              <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-10 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all">Save Nutrition Plan</button>
            </div>
          </form>
        </div>
      )}

      {/* --- GRID OF PLANS (Hides when Creating) --- */}
      {!isCreating && (
        <div className="animate-fade-in">
          {loading ? (
            <div className="text-center py-20 text-gray-500 animate-pulse text-sm">Syncing Database...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.length === 0 ? (
                <div className="col-span-full text-center py-24 bg-white/5 rounded-[2rem] border border-white/5 border-dashed">
                  <FaAppleAlt className="mx-auto text-5xl text-gray-700 mb-6 opacity-20" />
                  <p className="text-gray-500 font-bold italic">No active nutrition protocols assigned.</p>
                </div>
              ) : (
                plans.map((plan) => (
                  <div key={plan.id} className="bg-gray-900/60 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] hover:border-green-500/30 transition-all group relative shadow-xl">
                    <button onClick={() => api.delete(`/trainer/diet-plans/${plan.id}`).then(fetchData)} className="absolute top-6 right-6 text-gray-600 hover:text-red-500"><FaTrash size={14}/></button>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-green-500/10 p-3 rounded-xl text-green-500"><FaLeaf /></div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{plan.title}</h3>
                        <span className="text-[10px] font-bold uppercase text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md">{plan.goal}</span>
                      </div>
                    </div>

                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 mb-6">
                       <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Target Calories</p>
                       <p className="text-2xl font-black text-white">{plan.daily_calories} <span className="text-xs text-green-500 font-bold uppercase">kcal/day</span></p>
                    </div>

                    {/* MACROS DISPLAY */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                       <div className="bg-white/5 p-2 rounded-lg text-center border border-white/5">
                          <p className="text-[8px] text-gray-500 font-bold uppercase">Pro</p>
                          <p className="text-blue-400 font-bold text-xs">{plan.protein || '--'}g</p>
                       </div>
                       <div className="bg-white/5 p-2 rounded-lg text-center border border-white/5">
                          <p className="text-[8px] text-gray-500 font-bold uppercase">Carbs</p>
                          <p className="text-yellow-400 font-bold text-xs">{plan.carbs || '--'}g</p>
                       </div>
                       <div className="bg-white/5 p-2 rounded-lg text-center border border-white/5">
                          <p className="text-[8px] text-gray-500 font-bold uppercase">Fats</p>
                          <p className="text-red-400 font-bold text-xs">{plan.fats || '--'}g</p>
                       </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase border-t border-white/5 pt-4">
                       <span className="flex items-center gap-2"><FaCalendarAlt className="text-green-600" /> {new Date(plan.start_date).toLocaleDateString()}</span>
                       <span className="bg-white/5 px-2 py-1 rounded italic uppercase text-[8px]">Active</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}