import { useState, useEffect } from 'react'
import { FaCalendarAlt, FaClock, FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import api from '../../services/api'

export default function TraineeClassBooking() {
  const [availableSessions, setAvailableSessions] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [bookingTrainer, setBookingTrainer] = useState(null)

  const timeSlots = ['09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00']

  const fetchAvailableSessions = async () => {
    try {
      setLoading(true)
      const res = await api.get('/trainee/available-sessions', {
        params: { date: selectedDate, time: selectedTime }
      })
      setAvailableSessions(res.data.availableSessions || [])
    } catch (err) {
      console.error('Error loading sessions:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyBookings = async () => {
    try {
      const res = await api.get('/trainee/my-bookings')
      setMyBookings(res.data.bookings || [])
    } catch (err) {
      console.error('Error loading bookings:', err)
    }
  }

  useEffect(() => {
    fetchAvailableSessions()
    fetchMyBookings()
  }, [selectedDate, selectedTime])

  const handleBookSession = async (trainer) => {
    if (!confirm(`Book session with ${trainer.trainer_name} on ${selectedDate} at ${selectedTime}?`)) return
    
    try {
      await api.post('/trainee/book-session', {
        trainer_id: trainer.trainer_id,
        session_date: selectedDate,
        session_time: selectedTime
      })
      alert('✅ Session booked successfully!')
      fetchAvailableSessions()
      fetchMyBookings()
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Booking failed'))
    }
  }

  return (
    <div className="animate-fade-in-up pb-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Book Training Sessions
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Choose available trainers. Max 3 trainees per session.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
            >
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchAvailableSessions}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-60"
          >
            {loading ? 'Searching...' : <><FaUsers className="inline mr-2" /> Find Trainers</>}
          </button>
        </div>
      </div>

      {/* Available Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Trainers */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaUsers className="text-blue-400" /> Available Trainers
          </h3>
          
          {loading ? (
            <div className="text-center py-12 text-gray-500">Searching for available trainers...</div>
          ) : availableSessions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaUsers className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p>No trainers available for this time slot</p>
              <p className="text-sm mt-2">Try a different date or time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableSessions.map((session, idx) => (
                <div key={idx} className="group bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl p-6 transition-all hover:shadow-xl hover:shadow-blue-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold">
                        {session.trainer_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{session.trainer_name}</h4>
                        <p className="text-sm text-gray-400">{session.session_date} at {session.session_time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{session.booked_slots || 0}/3</div>
                      <div className="text-xs text-gray-500">slots filled</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookSession(session)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-green-500/30 transition-all group-hover:scale-[1.02]"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Bookings */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaCalendarAlt className="text-emerald-400" /> My Bookings
          </h3>
          
          {myBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaCalendarAlt className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p>No bookings yet</p>
              <p className="text-sm mt-2">Book your first session above</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {myBookings.slice(0, 8).map(booking => (
                <div key={booking.id} className="bg-black/40 border border-white/10 rounded-xl p-4 hover:bg-black/60 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {booking.trainer_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{booking.trainer_name}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(booking.session_date).toLocaleDateString('en-GB')} at {booking.session_time}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      booking.status === 'booked' ? 'bg-blue-500/20 text-blue-400' :
                      booking.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {booking.status === 'booked' && <FaClock />}
                      {booking.status === 'completed' && <FaCheckCircle />}
                      {booking.status === 'cancelled' && <FaTimesCircle />}
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  {booking.notes && (
                    <p className="text-xs text-gray-500 mt-2 ml-13">{booking.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
