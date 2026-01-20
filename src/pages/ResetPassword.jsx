import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token'); 
  
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ type: 'error', message: 'Passwords do not match' });
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({ token, newPassword: formData.newPassword });
      setStatus({ type: 'success', message: 'Password updated! Redirecting to login...' });
      setTimeout(() => navigate('/signin'), 3000);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to reset password. Link may be expired.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side - Reset Box */}
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="bg-dark-card rounded-2xl p-10 border border-gray-800 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">New Password</h2>
              <p className="text-gray-400">Secure your Fit Hub account</p>
            </div>

            {/* Status Message */}
            {status.message && (
              <div className={`px-4 py-3 rounded-lg mb-6 text-sm border ${
                status.type === 'success' 
                  ? 'bg-green-500/10 border-green-500 text-green-500' 
                  : 'bg-red-500/10 border-red-500 text-red-500'
              }`}>
                {status.message}
              </div>
            )}

            {!token && (
              <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded-lg mb-6 text-sm">
                Invalid or missing reset token. Please request a new link.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-crimson transition-all"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  required
                  disabled={loading || !token}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-crimson transition-all"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  disabled={loading || !token}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-crimson hover:bg-crimson/90 text-white py-3 rounded-lg font-semibold transition-all shadow-glow-red mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>

            <div className="text-center mt-8">
              <Link to="/signin" className="text-gray-400 hover:text-white text-sm transition-colors">
                Return to Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Matching Circular Image */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-zinc-600 rounded-full blur opacity-25 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative w-[450px] h-[450px] rounded-full overflow-hidden border-2 border-red-600/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000" 
                alt="Security"
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;