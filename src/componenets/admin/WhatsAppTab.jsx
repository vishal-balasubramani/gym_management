import { useState, useEffect } from 'react'
import { FaWhatsapp, FaPaperPlane, FaUserCircle } from 'react-icons/fa'
import api from '../../services/api'

export default function WhatsAppTab() {
  const [members, setMembers] = useState([])
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/admin/members')
        console.log("Fetched Members Data:", res.data.members) // DEBUG: Check console
        setMembers(res.data.members || [])
      } catch (err) { console.error(err) }
    }
    fetchMembers()
  }, [])

  // Helper to format phone numbers
  const formatPhoneNumber = (phone) => {
    if (!phone) return null
    let cleanNumber = phone.toString().replace(/\D/g, '') // Remove non-digits
    
    // If it's 10 digits, add 91 (India)
    if (cleanNumber.length === 10) return `91${cleanNumber}`
    
    // If it's 12 digits starting with 91, keep it
    if (cleanNumber.length === 12 && cleanNumber.startsWith('91')) return cleanNumber
    
    // If it's valid international length (10-15 digits), trust it
    if (cleanNumber.length > 9 && cleanNumber.length < 16) return cleanNumber

    return null
  }

    const handleSend = (e) => {
    e.preventDefault()
    if (!selectedMemberId || !message) return

    console.log("Searching for ID:", selectedMemberId) // Debug log

    // FIX: Convert both to string for safe comparison
    const member = members.find(m => String(m.id) === String(selectedMemberId))
    
    if (!member) {
      console.error("Available IDs:", members.map(m => m.id))
      alert(`Error: Member ID ${selectedMemberId} not found in list.`)
      return
    }

    // Check for phone number in likely fields
    const rawPhone = member.phone || member.phone_number || member.contact
    
    if (!rawPhone) {
      alert(`Error: No phone number found for ${member.name}.`)
      return
    }

    const formattedPhone = formatPhoneNumber(rawPhone)

    if (!formattedPhone) {
      alert(`❌ Invalid phone format: "${rawPhone}". Should be 10 digits.`)
      return
    }

    // Create WhatsApp Link
    const text = encodeURIComponent(`Hi ${member.name}, \n\n${message}`)
    const url = `https://wa.me/${formattedPhone}?text=${text}`
    
    window.open(url, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* --- Header --- */}
      <div className="text-center mb-10">
        <div className="inline-block p-5 bg-green-500/10 rounded-full mb-4 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          <FaWhatsapp className="text-green-500 text-5xl" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">WhatsApp Direct</h1>
        <p className="text-gray-400">Send quick updates or reminders to members directly.</p>
      </div>

      {/* --- Main Card --- */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSend} className="space-y-8">
          
          {/* Recipient Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <FaUserCircle className="text-green-400" /> Recipient
            </label>
            <div className="relative group">
              <select
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 outline-none focus:border-green-500 transition-all appearance-none cursor-pointer hover:bg-black/50"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                required
              >
                <option value="" className="bg-gray-800 text-gray-400">-- Select a Member --</option>
                {members.map(m => {
                  const displayPhone = m.phone || m.phone_number || 'No Phone'
                  return (
                    <option key={m.id} value={m.id} className="bg-gray-800 text-white py-2">
                      {m.name} &nbsp; • &nbsp; {displayPhone}
                    </option>
                  )
                })}
              </select>
              {/* Custom Arrow Icon */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                ▼
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">Message</label>
            <textarea
              rows="6"
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 outline-none focus:border-green-500 transition-all placeholder-gray-500 resize-none hover:bg-black/50"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <p className="text-xs text-gray-500 text-right italic">
              Clicking send will open WhatsApp Web or the App.
            </p>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-500/20 transform hover:-translate-y-0.5"
          >
            <FaPaperPlane /> Open in WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}
