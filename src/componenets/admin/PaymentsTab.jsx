import { useState, useEffect } from 'react'
import { FaSearch, FaMoneyBillWave, FaFilter } from 'react-icons/fa'
import api from '../../services/api'

export default function PaymentsTab() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/payments')
      // Ensure we set the payments array from response.data.payments
      setPayments(response.data.payments || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate Stats safely using parseFloat to handle DB numeric types
  const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
  const successCount = payments.filter(p => p.status === 'success').length

  // Filter Logic matching your users and payments schema
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || payment.payment_method === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* --- Stats Header --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg">
          <p className="text-green-400 font-medium mb-1 uppercase text-xs tracking-widest">Total Revenue</p>
          <h2 className="text-3xl font-bold text-white">₹{totalRevenue.toLocaleString()}</h2>
        </div>
        
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg">
          <p className="text-blue-400 font-medium mb-1 uppercase text-xs tracking-widest">Successful Transactions</p>
          <h2 className="text-3xl font-bold text-white">{successCount}</h2>
        </div>
        
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col justify-center">
           <h2 className="text-xl font-bold text-white">Transaction History</h2>
           <p className="text-gray-400 text-xs">Verified via Database Sync</p>
        </div>
      </div>

      {/* --- Filters & Search --- */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search member, email, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 text-white pl-12 pr-4 py-3 rounded-lg outline-none border border-white/5 focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="relative w-full md:w-64">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-black/40 text-white pl-12 pr-4 py-3 rounded-lg outline-none border border-white/5 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Methods</option>
              <option value="razorpay">Razorpay</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- Table Section --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Fetching records...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-gray-900/60 border border-white/10 rounded-xl p-12 text-center">
           <FaMoneyBillWave className="mx-auto text-gray-600 mb-4" size={40} />
           <h3 className="text-white font-bold">No Transactions Found</h3>
           <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold text-xs uppercase tracking-wider">Date & ID</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold text-xs uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold text-xs uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold text-xs uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      {/* FIXED: Using created_at instead of payment_date */}
                      <div className="text-gray-300 font-medium">
                        {payment.created_at ? new Date(payment.created_at).toLocaleDateString('en-IN') : 'N/A'}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono mt-1">{payment.transaction_id || 'manual_entry'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{payment.user_name}</div>
                      <div className="text-xs text-gray-400">{payment.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-400 font-bold">
                        ₹{parseFloat(payment.amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="capitalize text-gray-300 text-xs px-2 py-1 bg-white/5 rounded border border-white/10">
                         {payment.payment_method || 'Online'}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                        payment.status === 'success' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}