import { useState, useEffect } from 'react'
import { FaPlus, FaTrash, FaDumbbell, FaClock, FaSignal, FaArrowLeft, FaUserAlt } from 'react-icons/fa'
import api from '../../services/api'

export default function WorkoutPlansTab() {
  const [plans, setPlans] = useState([])
  const [trainees, setTrainees] = useState([]) // Logic to handle the 3-trainee squad
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  // Form State - Added trainee_id for assignment logic
  const [formData, setFormData] = useState({
    trainee_id: '', 
    title: '',
    goal: 'Weight Loss',
    difficulty: 'Beginner',
    duration_weeks: 4,
    description: ''
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      // Fetch both workout plans and the active trainee list
      const [plansRes, traineesRes] = await Promise.all([
        api.get('/trainer/plans'),
        api.get('/trainer/trainees')
      ])
      setPlans(plansRes.data.plans || [])
      setTrainees(traineesRes.data.activeTrainees || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return
    try {
      await api.delete(`/trainer/plans/${id}`)
      setPlans(plans.filter(p => p.id !== id))
    } catch (error) {
      alert("Failed to delete plan")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.trainee_id) return alert("Please select a student to assign this plan.")
    
    try {
      await api.post('/trainer/plans', formData)
      alert("Plan created successfully!")
      setShowCreateForm(false)
      fetchInitialData() 
      // Reset form
      setFormData({ trainee_id: '', title: '', goal: 'Weight Loss', difficulty: 'Beginner', duration_weeks: 4, description: '' })
    } catch (error) {
      console.error("Create error:", error)
      alert("Failed to create plan")
    }
  }

  if (loading) return <div className="text-white text-center py-10">Loading plans...</div>

  return (
    <div className="animate-fade-in">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FaDumbbell className="text-blue-500" /> Workout Plans
        </h2>
        {!showCreateForm && (
          <button 
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
          >
            <FaPlus /> Create New Plan
          </button>
        )}
      </div>

      {/* CREATE FORM - UI & Layout preserved */}
      {showCreateForm ? (
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-white">Design New Plan</h3>
            <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
              <FaArrowLeft /> Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Added: Trainee Selection Logic */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Assign Trainee</label>
              <select 
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={formData.trainee_id}
                onChange={(e) => setFormData({...formData, trainee_id: e.target.value})}
              >
                <option value="">Select a student...</option>
                {trainees.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Plan Title</label>
              <input 
                type="text" 
                required 
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                placeholder="e.g., 30-Day Shred"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Fitness Goal</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
              >
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>Endurance</option>
                <option>Flexibility</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Difficulty</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Duration (Weeks) Days</label>
              <input 
                type="number" 
                min="1" max="52"
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={formData.duration_weeks}
                onChange={(e) => setFormData({...formData, duration_weeks: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">Description / Instructions</label>
              <textarea 
                rows="4"
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                placeholder="Describe the plan details..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg">
                Save Workout Plan
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* PLANS LIST GRID - Hides correctly when form is open */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500">
              No workout plans yet. Create your first one!
            </div>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="group bg-gray-900/40 border border-white/5 hover:border-blue-500/50 rounded-xl p-5 transition-all hover:-translate-y-1 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{plan.title}</h3>
                  <button onClick={() => handleDelete(plan.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                    <FaTrash />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/20">
                    {plan.goal}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded border ${
                    plan.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    plan.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {plan.difficulty}
                  </span>
                </div>

                {/* Display logic for assigned student */}
                <p className="text-blue-400 text-[10px] font-bold uppercase mb-4 flex items-center gap-2">
                  <FaUserAlt size={10}/> Assigned: {plan.trainee_name || 'Generic'}
                </p>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                  {plan.description || 'No description provided.'}
                </p>

                <div className="flex items-center gap-4 text-gray-500 text-sm border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1">
                    <FaClock /> {plan.duration_weeks} Weeks
                  </div>
                  <div className="flex items-center gap-1">
                    <FaSignal /> {plan.difficulty}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}