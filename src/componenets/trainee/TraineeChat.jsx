import React, { useState, useEffect, useRef } from 'react'
import { FaPaperPlane, FaUserTie, FaCircle, FaChevronLeft, FaInfoCircle, FaSearch } from 'react-icons/fa'
import api from '../../services/api'

export default function TraineeChat() {
  const [trainers, setTrainers] = useState([])
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchTrainers()
  }, [])

  useEffect(() => {
    if (!selectedTrainer) return
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [selectedTrainer])

  const fetchTrainers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/trainee/messages/trainers')
      setTrainers(res.data || [])
    } catch (err) {
      console.error("Error fetching trainers:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/trainee/messages/${selectedTrainer.user_id}`)
      setMessages(res.data || [])
      scrollToBottom()
    } catch (err) {
      console.error("Fetch Messages Error:", err)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const msgContent = newMessage
    setNewMessage('')

    try {
      // Optimistic update
      const tempMsg = {
        id: Date.now(),
        sender_id: 'me',
        content: msgContent,
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, tempMsg])
      scrollToBottom()

      await api.post('/trainee/messages/send', {
        receiverId: selectedTrainer.user_id,
        content: msgContent
      })
      fetchMessages()
    } catch (err) {
      alert("Message failed to send.")
    }
  }

  return (
    <div className="max-w-6xl mx-auto h-[78vh] flex flex-col md:flex-row gap-6 animate-fade-in px-2">
      
      {/* --- Sidebar: Trainer List --- */}
      <div className={`w-full md:w-80 bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 flex flex-col shadow-2xl transition-all duration-300 ${selectedTrainer ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-white font-bold text-lg tracking-tight">Messages</h3>
          <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">Support</span>
        </div>

        {/* Search Mockup (Visual only for now) */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
          <input 
            type="text" 
            placeholder="Search trainers..." 
            className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:border-blue-500/50 outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {loading ? (
            <div className="text-center py-10 text-gray-500 text-xs animate-pulse">Checking connections...</div>
          ) : trainers.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white/5 rounded-2xl border border-white/5 border-dashed">
              <p className="text-gray-500 text-xs leading-relaxed italic">No active trainers found. Book a session to start your journey.</p>
            </div>
          ) : (
            trainers.map(t => (
              <div 
                key={t.user_id}
                onClick={() => setSelectedTrainer(t)}
                className={`group p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${
                  selectedTrainer?.user_id === t.user_id 
                    ? 'bg-blue-600/20 border-blue-500/30 shadow-lg' 
                    : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                <div className="relative">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-blue-500 border border-white/10 shadow-inner">
                     <FaUserTie size={20} />
                   </div>
                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 shadow-sm"></div>
                </div>
                <div className="min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${selectedTrainer?.user_id === t.user_id ? 'text-white' : 'text-gray-300'}`}>{t.name}</h4>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Assigned Trainer</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- Main Chat Window --- */}
      <div className={`flex-1 bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex flex-col shadow-2xl overflow-hidden relative ${!selectedTrainer ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Aesthetic Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        {selectedTrainer ? (
          <>
            {/* Header */}
            <div className="p-5 border-b border-white/10 bg-black/30 flex items-center justify-between relative z-10 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedTrainer(null)} className="md:hidden text-gray-400 hover:text-white transition-colors">
                  <FaChevronLeft size={20} />
                </button>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {selectedTrainer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base tracking-tight">{selectedTrainer.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Support</span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-gray-500 text-xs">
                 <FaInfoCircle /> <span className="font-medium">Direct Message</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar relative z-10">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-3">
                   <div className="bg-white/5 p-4 rounded-full"><FaUserTie size={24} className="opacity-20" /></div>
                   <p className="text-xs font-medium italic">Ask your trainer about your form, diet, or routine.</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isSentByMe = msg.sender_id !== selectedTrainer.user_id;
                  return (
                    <div key={idx} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                      <div className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-xl ${
                        isSentByMe 
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none border border-blue-400/20' 
                          : 'bg-gray-800/80 text-gray-200 rounded-tl-none border border-white/5'
                      }`}>
                        {msg.content}
                        <div className={`text-[9px] mt-2 font-bold opacity-40 uppercase ${isSentByMe ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-5 bg-black/40 border-t border-white/10 relative z-10 backdrop-blur-xl">
              <form onSubmit={handleSend} className="flex gap-3">
                <input 
                  type="text"
                  placeholder={`Write a message to Coach ${selectedTrainer.name.split(' ')[0]}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600 shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-600/20 group"
                >
                  <FaPaperPlane size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-12 text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-full flex items-center justify-center text-4xl shadow-2xl border border-white/5">
              💬
            </div>
            <div className="space-y-2">
               <h3 className="text-white font-bold text-xl tracking-tight">Trainer Support</h3>
               <p className="text-sm max-w-xs mx-auto leading-relaxed text-gray-400">
                 Connect directly with your personal trainer to fine-tune your performance and get expert feedback.
               </p>
            </div>
            <div className="pt-4">
               <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Select a trainer to begin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}