import { useState, useEffect } from 'react'
import { FaBars, FaLock } from 'react-icons/fa' // Added Lock Icon
import api from '../services/api'
import Sidebar from '../componenets/Sidebar'
import TraineeOverview from '../componenets/trainee/TraineeOverview' 
import TraineeWorkoutPlan from '../componenets/trainee/TraineeWorkoutPlan'
import TraineeDietPlan from '../componenets/trainee/TraineeDietPlan'
import TraineeAttendance from '../componenets/trainee/TraineeAttendance'
import TraineePayment from '../componenets/trainee/TraineePayment'
import TraineeProgress from '../componenets/trainee/TraineeProgress'
import TraineeClassBooking from '../componenets/trainee/TraineeClassBooking'
import TraineeChat from '../componenets/trainee/TraineeChat'
export default function TraineeDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // New State: Store Plan Features
  const [planFeatures, setPlanFeatures] = useState([]) 

  const [stats, setStats] = useState({
    weight: 'N/A',
    weightChange: '...',
    bmi: 'N/A',
    bmiStatus: 'Calculating...',
    workouts: 0,
    workoutGoal: 20,
    status: 'Loading...',
    expiry: '...',
    recentSessions: []
  })

  // ✅ Helper to check features
  const hasFeature = (featureName) => {
    // If Admin/Dev mode or no features loaded yet, be careful. 
    // Assuming features are strings in an array like ["Diet Plan", "Personal Trainer"]
    if (!planFeatures || planFeatures.length === 0) return false;
    return planFeatures.some(f => f.toLowerCase().includes(featureName.toLowerCase()));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Stats (Existing)
        const resStats = await api.get('/trainee/dashboard-stats')
        setStats({
          weight: resStats.data.stats.currentWeight + ' Kg',
          weightChange: resStats.data.stats.weightChange,
          bmi: resStats.data.stats.bmi,
          bmiStatus: resStats.data.stats.bmiStatus,
          workouts: resStats.data.stats.workoutsCompleted,
          workoutGoal: resStats.data.stats.workoutGoal,
          status: resStats.data.stats.membershipStatus,
          expiry: 'Expires ' + resStats.data.stats.expiryDate,
          recentSessions: resStats.data.stats.recentSessions
        })

        // 2. Fetch User Profile/Features (NEW)
        // You need to ensure your /auth/me or /trainee/profile endpoint returns 'plan_features'
        // If not, you might need to update the backend as discussed previously.
        const resUser = await api.get('/auth/me') 
        if (resUser.data.user && resUser.data.user.membership) {
            // Assuming backend sends features here. 
            // If backend doesn't send it yet, you might need to fetch /trainee/plans/my-plan
            // For now, let's try to get it if available, or default to empty
             const features = resUser.data.user.membership.features || [] 
             // If features come as CSV string "Diet, Cardio" -> convert to array
             const featuresArray = Array.isArray(features) ? features : (typeof features === 'string' ? features.split(',') : [])
             setPlanFeatures(featuresArray)
        }

      } catch (err) {
        console.error("Error loading trainee dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ✅ Intercept Tab Switching for Gated Features
  const handleTabChange = (tab) => {
      if (tab === 'diet' && !hasFeature('Diet')) {
          alert("🔒 This feature is locked! Please upgrade your plan to access Diet Plans.")
          return;
      }
      if (tab === 'chat' && !hasFeature('Trainer')) { // or 'Personal Trainer'
          alert("🔒 This feature is locked! Please upgrade your plan to access Personal Trainer Chat.")
          return;
      }
      setActiveTab(tab)
      setMobileMenuOpen(false) // Close mobile menu on selection
  }

  return (
    <div className="min-h-screen flex bg-black font-sans text-white relative overflow-x-hidden">
      
      {/* 1. Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://i.shgcdn.com/d61f124a-5eb2-41c7-abd1-ace0dd6f7d97/-/format/auto/-/preview/3000x3000/-/quality/lighter/"
          className="w-full h-full object-cover opacity-60" 
          alt="Gym Background"
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* 2. Sidebar - Passing modified setActiveTab */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
            role="trainee" 
            activeTab={activeTab} 
            setActiveTab={handleTabChange} // ✅ Use intercepted handler
            setMobileMenuOpen={setMobileMenuOpen} 
            mobileMenuOpen={mobileMenuOpen}
            // Optional: You can pass planFeatures to Sidebar to show lock icons there too if you modify Sidebar.jsx
         />
      </div>

      {/* 3. Main Content */}
      <main className="flex-1 md:ml-64 relative z-10 p-6 md:p-10 h-screen overflow-y-auto custom-scrollbar">
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">FitHub</h1>
            <button className="text-white text-2xl p-2 bg-white/10 rounded-lg" onClick={() => setMobileMenuOpen(true)}>
              <FaBars />
            </button>
        </div>

        {/* --- COMPACT HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-lg">
          <div className="mb-4 md:mb-0">
             <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">
               Dashboard Overview
             </h1>
             <p className="text-blue-200 text-xs md:text-sm font-medium tracking-wide">
               Welcome back, Trainee!
             </p>
          </div>
          <div className="text-right">
             <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">
               Current Date
             </p>
             <div className="text-lg md:text-xl font-medium text-white font-mono">
               {new Date().toLocaleDateString('en-GB', { 
                  weekday: 'long', day: 'numeric', month: 'long' 
               })}
             </div>
          </div>
        </header>

        {/* --- TABS --- */}
        {activeTab === 'dashboard' && (
           loading ? (
             <div className="text-center py-20 text-gray-500">Loading your stats...</div>
           ) : (
             <TraineeOverview stats={stats} />
           )
        )}

        {activeTab === 'workout' && <TraineeWorkoutPlan />}
        
        {/* Protected Tabs */}
        {activeTab === 'diet' && (
            // Double protection inside the render
            hasFeature('Diet') ? <TraineeDietPlan /> : <div className="text-center py-20 text-red-400"><FaLock className="inline mb-1"/> Access Denied</div>
        )}

        {activeTab === 'payment' && <TraineePayment />}
        {activeTab === 'attendance' && <TraineeAttendance />}

        {activeTab === 'progress' && <TraineeProgress />}
        {activeTab === 'classes' && <TraineeClassBooking />}
        
        {activeTab === 'chat' && (
        hasFeature('Trainer') ? 
          <TraineeChat /> : 
          <div className="flex flex-col items-center justify-center py-20 bg-gray-900/40 rounded-3xl border border-white/5 shadow-xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <FaLock className="text-red-400 text-2xl"/>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Trainer Chat Locked</h3>
            <p className="text-gray-400 text-center max-w-xs px-6">
              Personalized chat support is only available for Pro and Elite members. 
              Please upgrade your plan to unlock this feature.
            </p>
          </div>
      )}

      </main>
    </div>
  )
}
