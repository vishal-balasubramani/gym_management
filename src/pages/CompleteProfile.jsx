import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { traineeAPI } from '../services/api' 
import { FaPhoneAlt, FaRulerVertical, FaWeight, FaBullseye } from 'react-icons/fa'

const CompleteProfile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState({
    height: '',
    current_weight: '',
     
    fitness_goal: 'Weight Loss'
  })

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    if (!details.height || !details.current_weight || !details.phone) {
        alert("Please fill in all fields.")
        setLoading(false)
        return
    }

    try {
      // ✅ Payload now matches your 'phone' column in DB
      const payload = {
        height: parseFloat(details.height),
        current_weight: parseFloat(details.current_weight),
        phone: details.phone, 
        fitness_goal: details.fitness_goal
      }

      await traineeAPI.completeProfile(payload)
      navigate('/trainee')

    } catch (error) {
      console.error("❌ Profile update failed:", error)
      const serverMessage = error.response?.data?.message || "Connection failed."
      alert(`Failed: ${serverMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Build Your Profile</h2>
              <p className="text-gray-400 font-medium tracking-normal">Step 2: Let's personalize your plan</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
            
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-gray-300 mb-2 text-sm font-medium">
                    <FaRulerVertical className="text-blue-500 text-xs"/> Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={details.height}
                    onChange={handleChange}
                    placeholder="175"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-normal"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-300 mb-2 text-sm font-medium">
                    <FaWeight className="text-blue-500 text-xs"/> Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="current_weight"
                    value={details.current_weight}
                    onChange={handleChange}
                    placeholder="70"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-normal"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2 text-sm font-medium">
                  <FaBullseye className="text-blue-500 text-xs"/> Primary Goal
                </label>
                <div className="relative">
                  <select
                    name="fitness_goal"
                    value={details.fitness_goal}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 font-normal"
                    disabled={loading}
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Endurance">Endurance Training</option>
                    <option value="Flexibility">Flexibility & Yoga</option>
                    <option value="General Health">General Health</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20 mt-4 disabled:opacity-50"
              >
                {loading ? 'Saving Profile...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-[450px] h-[450px] rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                    <img
                        src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000"
                        alt="Profile Setup"
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfile