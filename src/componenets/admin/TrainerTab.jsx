import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaDumbbell, FaEnvelope, FaPhone, FaStar } from 'react-icons/fa'
import api from '../../services/api'
import AddTrainerModal from './AddTrainerModal'
import EditTrainerModal from './EditTrainerModal'

export default function TrainersTab() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/trainers')
      setTrainers(response.data.trainers || [])
    } catch (error) {
      console.error('Error fetching trainers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this trainer?')) return

    try {
      await api.delete(`/admin/trainers/${userId}`)
      setTrainers(trainers.filter(t => t.user_id !== userId))
      alert('✅ Trainer deleted successfully!')
    } catch (error) {
      alert('❌ Failed to delete trainer')
      fetchTrainers()
    }
  }

  const handleEdit = (trainer) => {
    setSelectedTrainer(trainer)
    setShowEditModal(true)
  }

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trainer.specialization && trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div>
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Trainers</h1>
          <p className="text-gray-400 flex items-center gap-2">
            {/* Updated Badge Color to Blue */}
            <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs font-bold border border-blue-500/20">
              {trainers.length} Total
            </span>
            Professional staff members
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          /* Updated Button Color to Blue Gradient */
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl transition-all flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 border border-blue-500/50"
        >
          <FaPlus /> Add Trainer
        </button>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-8 shadow-lg">
        <div className="relative group">
          {/* Updated Icon & Focus Colors */}
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder="Search trainers by name, email, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 text-white pl-12 pr-4 py-3 rounded-lg outline-none border border-transparent focus:border-blue-500/50 transition-all placeholder-gray-500"
          />
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          {/* Updated Spinner Color */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-gray-300 font-medium">Loading trainers...</p>
        </div>
      ) : filteredTrainers.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center max-w-md shadow-xl">
            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <FaDumbbell className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">No Trainers Found</h3>
            <p className="text-gray-400 mb-8">
              {searchTerm ? 'Try a different search term.' : 'Add your first trainer to get started.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold uppercase text-xs tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold uppercase text-xs tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold uppercase text-xs tracking-wider">Specialization</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold uppercase text-xs tracking-wider">Experience</th>
                  <th className="px-6 py-4 text-center text-gray-400 font-bold uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTrainers.map((trainer) => (
                  <tr key={trainer.id} className="hover:bg-white/5 transition-colors group">
                    
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Updated Avatar Gradient to Blue/Purple */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white/10">
                          {trainer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-bold">{trainer.name}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-300 text-xs">
                           <FaEnvelope className="text-gray-500" /> {trainer.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                           <FaPhone className="text-gray-500" /> {trainer.phone || 'N/A'}
                        </div>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="px-6 py-4">
                      {/* Updated Badge to Cyan/Blue */}
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 inline-block">
                        {trainer.specialization || 'General Fitness'}
                      </span>
                    </td>

                    {/* Experience */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                        <FaStar className="text-yellow-500 text-xs" />
                        <span className="font-medium">{trainer.experience_years} Years</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(trainer)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-blue-500/20"
                          title="Edit Trainer"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(trainer.user_id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                          title="Delete Trainer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODALS --- */}
      {showAddModal && (
        <AddTrainerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchTrainers} 
        />
      )}

      {showEditModal && selectedTrainer && (
        <EditTrainerModal
          trainer={selectedTrainer}
          onClose={() => {
            setShowEditModal(false)
            setSelectedTrainer(null)
          }}
          onSuccess={fetchTrainers}
        />
      )}
    </div>
  )
}
