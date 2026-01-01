import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUser, FaCrown, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import api from '../../services/api'
import AddMemberModal from './AddMemberModel'
import EditMemberModal from './EditMemberModel'

export default function MembersTab() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/members')
      setMembers(response.data.members || [])
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      await api.delete(`/admin/members/${id}`)
      alert('✅ Member deleted successfully!')
      fetchMembers()
    } catch (error) {
      alert('❌ Failed to delete member')
      console.error(error)
    }
  }

  const handleEdit = (member) => {
    setSelectedMember(member)
    setShowEditModal(true)
  }

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Members</h1>
          <p className="text-gray-400 flex items-center gap-2">
            <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs font-bold border border-blue-500/20">
              {members.length} Total
            </span>
            Active registered members
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 border border-blue-500/50"
        >
          <FaPlus /> Add Member
        </button>
      </div>

      {/* Search Bar */}
      {members.length > 0 && (
        <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-8 shadow-lg">
          <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 text-white pl-12 pr-4 py-3 rounded-lg outline-none border border-transparent focus:border-blue-500/50 transition-all placeholder-gray-500"
            />
          </div>
        </div>
      )}

      {/* Members List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-gray-300 font-medium">Loading members list...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center max-w-md shadow-xl">
            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <FaUser className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">
              {searchTerm ? 'No Members Found' : 'No Members Yet'}
            </h3>
            <p className="text-gray-400 mb-8">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first gym member.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all font-bold shadow-lg shadow-blue-500/20"
              >
                Add First Member
              </button>
            )}
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
                  <th className="px-6 py-4 text-left text-gray-400 font-bold uppercase text-xs tracking-wider">Plan</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold uppercase text-xs tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-bold uppercase text-xs tracking-wider">Details</th>
                  <th className="px-6 py-4 text-center text-gray-400 font-bold uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                    
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg border border-white/10">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-bold">{member.name}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-300 text-sm">{member.email}</span>
                        <span className="text-gray-500 text-xs">{member.phone || 'No phone'}</span>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      {member.plan_type ? (
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold w-fit border ${
                          member.plan_type === 'elite' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          member.plan_type === 'pro' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-green-500/10 text-green-400 border-green-500/20'
                        }`}>
                          <FaCrown size={10} />
                          {member.plan_type.toUpperCase()}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs italic">No Plan</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit border ${
                        member.membership_status === 'active' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {member.membership_status === 'active' ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                        {member.membership_status || 'Inactive'}
                      </div>
                    </td>

                    {/* Details (Weight/Goal) */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-300 text-xs font-medium">
                          {member.current_weight ? `${member.current_weight} kg` : '-'}
                        </span>
                        <span className="text-gray-500 text-[10px] uppercase tracking-wide">
                          {member.fitness_goal || 'No Goal'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-blue-500/20"
                          title="Edit Member"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                          title="Delete Member"
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

      {/* Modals */}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchMembers}
        />
      )}

      {showEditModal && selectedMember && (
        <EditMemberModal
          member={selectedMember}
          onClose={() => {
            setShowEditModal(false)
            setSelectedMember(null)
          }}
          onSuccess={fetchMembers}
        />
      )}
    </div>
  )
}
