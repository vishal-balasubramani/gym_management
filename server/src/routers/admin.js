import express from 'express'
import {
  getDashboardStats,
  getAllMembers,
  getMemberById,
  addMember,
  updateMember,
  deleteMember,
  getAllTrainers,
  addTrainer,
  updateTrainer,
  deleteTrainer,
  assignTrainer,
  getRecentPayments,
  addPayment,
  getAllSessions,
  createSession,
  getTodayAttendance,
  getAllAttendance,
  markAttendance,
  getAllMemberships,
  createMembership,
  updateMembershipStatus,
  getRevenueReport,
  getMembershipReport
} from '../controllers/adminController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Protect all admin routes
router.use(protect)
router.use(authorize('admin'))

// Dashboard
router.get('/dashboard-stats', getDashboardStats)

// Members
router.get('/members', getAllMembers)
router.get('/members/:id', getMemberById)
router.post('/members', addMember)
router.put('/members/:id', updateMember)
router.delete('/members/:id', deleteMember)

// Trainers
router.get('/trainers', getAllTrainers)
router.post('/trainers', addTrainer)
router.put('/trainers/:id', updateTrainer)
router.delete('/trainers/:id', deleteTrainer)
router.post('/assign-trainer', assignTrainer)

// Payments
router.get('/payments', getRecentPayments)
router.post('/payments', addPayment)

// Sessions
router.get('/sessions', getAllSessions)
router.post('/sessions', createSession)

// Attendance
router.get('/attendance/today', getTodayAttendance)
router.get('/attendance', getAllAttendance)
router.post('/attendance', markAttendance)

// Memberships
router.get('/memberships', getAllMemberships)
router.post('/memberships', createMembership)
router.put('/memberships/:id/status', updateMembershipStatus)

// Reports
router.get('/reports/revenue', getRevenueReport)
router.get('/reports/membership', getMembershipReport)

export default router
