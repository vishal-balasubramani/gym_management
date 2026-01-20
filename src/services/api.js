import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ==================== AUTH API ====================
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    
    // Save token to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    
    // Save token to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },


  forgotPassword: async (emailData) => {
    const response = await api.post('/auth/forgot-password', emailData)
    return response.data
  },

resetPassword: async (resetData) => {
    // resetData should contain { token, newPassword }
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  }
}

// ==================== ADMIN API ====================
export const adminAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard-stats')
    return response.data
  },

  getAllMembers: async () => {
    const response = await api.get('/admin/members')
    return response.data
  },

  addMember: async (memberData) => {
    const response = await api.post('/admin/members', memberData)
    return response.data
  },

  updateMember: async (id, memberData) => {
    const response = await api.put(`/admin/members/${id}`, memberData)
    return response.data
  },

  deleteMember: async (id) => {
    const response = await api.delete(`/admin/members/${id}`)
    return response.data
  }
}


// ==================== TRAINEE API ====================
export const traineeAPI = {
  completeProfile: async (profileData) => {
    const response = await api.post('/trainee/complete-profile', profileData)
    return response.data
  },
  
  getDashboardStats: async () => {
    const response = await api.get('/trainee/dashboard-stats')
    return response.data
  }
}
resetPassword: (data) => api.post('/auth/reset-password', data)

export default api
