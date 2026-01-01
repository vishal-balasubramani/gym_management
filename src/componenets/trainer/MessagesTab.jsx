import React, { useState, useEffect, useRef } from 'react'
import { FaPaperPlane, FaUserCircle, FaSearch, FaCircle } from 'react-icons/fa'
import api from '../../services/api'

export default function MessagesTab() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef(null)

  // 1. Load User List (Active Trainees linked to this Trainer)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const res = await api.get('/trainer/messages/list')
        setUsers(res.data || [])
      } catch (err) {
        console.error("Error fetching chat users:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  // 2. Load Messages when a Student is Selected
  useEffect(() => {
    if (!selectedUser) return
    fetchMessages()
    
    // Polling every 5 seconds to check for new trainee replies
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [selectedUser])

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/trainer/messages/${selectedUser.user_id}`)
      setMessages(res.data || [])
      scrollToBottom()
    } catch (err) {
      console.error("Fetch Messages Error:", err)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const msgContent = newMessage
    setNewMessage('')

    try {
      // Optimistic Update: Show immediately in UI
      const tempMsg = {
        id: Date.now(),
        sender_id: 'me', // temporary marker to identify trainer
        content: msgContent,
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, tempMsg])
      scrollToBottom()

      // Send to API
      await api.post('/trainer/messages', {
        receiverId: selectedUser.user_id,
        content: msgContent
      })
      
      fetchMessages() // Refresh to get real database IDs and timestamps
    } catch (err) {
      alert("Failed to send message. Please try again.")
    }
  }

  // Filter student list based on search term
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Assuming sender_id !== selectedUser.user_id means it's the Trainer (Me)
  const isMe = (msg) => msg.sender_id !== selectedUser?.user_id

  return (
    <div className="max-w-7xl mx-auto h-[82vh] animate-fade-in flex flex-col md:flex-row gap-6 p-2">
      
      {/* --- SIDEBAR: Trainee List --- */}
      <div className="w-full md:w-80 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col shadow-2xl">
        <h3 className="text-white font-black mb-6 text-xl tracking-tight uppercase text-xs opacity-50">Trainees</h3>
        
        {/* Search Input */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
          <input 
            type="text" 
            placeholder="Search students..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:border-blue-500/50 outline-none transition-all"
          />
        </div>

        <div className="overflow-y-auto flex-1 space-y-2 pr-2 custom-scrollbar">
          {loading ? (
            <div className="text-gray-500 text-center text-xs py-10 animate-pulse">Syncing chat list...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-gray-500 text-center text-xs py-10 border border-white/5 border-dashed rounded-xl">No trainees found.</div>
          ) : (
            filteredUsers.map(u => (
              <div 
                key={u.user_id}
                onClick={() => setSelectedUser(u)}
                className={`p-3 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${
                  selectedUser?.user_id === u.user_id
                    ? 'bg-blue-600/20 border-blue-500/30' 
                    : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  {u.profile_picture ? (
                    <img src={u.profile_picture} className="w-11 h-11 rounded-full object-cover border border-white/10" alt={u.name} />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-gray-400 border border-white/5">
                      <FaUserCircle className="text-2xl" />
                    </div>
                  )}
                  <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="min-w-0">
                  <h4 className={`text-sm font-bold truncate ${selectedUser?.user_id === u.user_id ? 'text-white' : 'text-gray-300'}`}>
                    {u.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">Active Session</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- MAIN: Chat Window --- */}
      <div className="flex-1 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Visual Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-5 border-b border-white/10 bg-black/20 flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-black shadow-lg">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{selectedUser.name}</h3>
                <p className="text-green-500 text-[10px] font-black uppercase flex items-center gap-1.5 tracking-widest">
                  <FaCircle className="text-[6px] animate-pulse" /> Live Now
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative z-10">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600">
                  <p className="font-black text-[10px] uppercase tracking-[0.3em]">Start a conversation</p>
                  <p className="text-xs mt-2 italic">Send workout tips or diet adjustments to {selectedUser.name.split(' ')[0]}</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${isMe(msg) ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                      isMe(msg) 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-500/10' 
                        : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5 shadow-inner'
                    }`}>
                      {msg.content}
                      <div className={`text-[9px] mt-2 font-black uppercase opacity-60 ${isMe(msg) ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <div className="p-4 bg-black/40 border-t border-white/10 relative z-10">
              <form onSubmit={handleSend} className="flex gap-3">
                <input 
                  type="text" 
                  className="flex-1 bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-600 focus:border-blue-500/50 outline-none transition-all shadow-inner"
                  placeholder={`Write to ${selectedUser.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-blue-500/30 group"
                >
                  <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-10 text-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner border border-white/5">
              💬
            </div>
            <h3 className="text-white font-black text-2xl tracking-tighter mb-2">Trainer Chat Support</h3>
            <p className="max-w-xs text-sm leading-relaxed">Choose a student from the left sidebar to coordinate workouts and provide feedback.</p>
          </div>
        )}
      </div>
    </div>
  )
}