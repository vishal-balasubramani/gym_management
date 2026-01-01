import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import api from '../../services/api'

export default function AddPaymentModal({ onClose, onSuccess }) {
  const [members, setMembers] = useState([])
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    paymentMethod: 'cash',
    transactionId: '',
    membershipId: null // Optional
  })
  const [loading, setLoading] = useState(false)

  // Fetch members so admin can select who is paying
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/admin/members')
        setMembers(res.data.members || [])
      } catch (err) {
        console.error("Failed to load members", err)
      }
    }
    fetchMembers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/admin/payments', formData)
      alert('✅ Payment recorded successfully!')
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    } catch (error) {
      alert('❌ Failed to record payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Record New Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FaTimes size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Select Member</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:border-green-500 outline-none"
              value={formData.userId}
              onChange={(e) => setFormData({...formData, userId: e.target.value})}
              required
            >
              <option value="">-- Choose Member --</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Amount (₹)</label>
            <input
              type="number"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:border-green-500 outline-none"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Payment Method</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:border-green-500 outline-none"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI / GPay / PhonePe</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Transaction ID (Optional)</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:border-green-500 outline-none"
              placeholder="e.g. UPI Ref No."
              value={formData.transactionId}
              onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all mt-4"
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>
        </form>
      </div>
    </div>
  )
}
