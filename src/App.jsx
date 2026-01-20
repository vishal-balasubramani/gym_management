import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AdminDashboard from './pages/AdminDashboard'
import TrainerDashboard from './pages/TrainerDashboard'
import TraineeDashboard from './pages/TraineeDashboard'
import ForgotPassword from './pages/ForgotPassword';// <--- Check this path
import ResetPassword from './pages/ResetPassword';
// ✅ Import the new page
import CompleteProfile from './pages/CompleteProfile' 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* ✅ ADD THIS LINE: This fixes the "No routes matched" error */}
        <Route path="/complete-profile" element={<CompleteProfile />} />
        
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/trainer" element={<TrainerDashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/trainee" element={<TraineeDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
