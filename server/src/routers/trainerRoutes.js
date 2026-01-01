import express from 'express'
import { 
  getTrainerStats, 
  getMyTrainees, 
  handleTraineeRequest,
  getPlans,
  createPlan,
  deletePlan
} from '../controllers/trainerController.js'
import { protect, authorize } from '../middleware/auth.js'
import { getDietPlans, createDietPlan, deleteDietPlan } from '../controllers/trainerController.js'
import { getTrainerSessions,updateSessionStatus } from '../controllers/trainerController.js'
import { getTraineesForAttendance, markAttendance } from '../controllers/trainerController.js'
import { getTraineeProgress, addProgressEntry } from '../controllers/trainerController.js'
import { getChatList, getMessages, sendMessage } from '../controllers/trainerController.js'

const router = express.Router()

// Apply protection and role authorization to ALL routes in this file
// Only logged-in users with role 'trainer' can access these
router.use(protect)
router.use(authorize('trainer'))

// --- Dashboard Routes ---
router.get('/dashboard-stats', getTrainerStats)

// --- Trainee Management Routes ---
router.get('/trainees', getMyTrainees)           // Get active trainees & new requests
router.post('/request-action', handleTraineeRequest) // Accept or Reject a trainee

// --- Workout Plan Routes ---
router.get('/plans', getPlans)                   // Get all plans created by this trainer
router.post('/plans', createPlan)                // Create a new workout plan
router.delete('/plans/:planId', deletePlan)

router.get('/diet-plans', protect,  getDietPlans)
router.post('/diet-plans', protect, createDietPlan)
router.delete('/diet-plans/:id', protect,deleteDietPlan)// Delete a workout plan

router.get('/my-sessions', protect, getTrainerSessions)
router.post('/update-session', protect, updateSessionStatus)

router.get('/progress/:traineeId', protect, getTraineeProgress)
router.post('/progress', protect,  addProgressEntry)

// --- ATTENDANCE ROUTES ---
router.get('/attendance', protect, getTraineesForAttendance)
router.post('/attendance', protect, markAttendance)

router.get('/messages/list', protect,  getChatList)
router.get('/messages/:userId', protect, getMessages)
router.post('/messages', protect, sendMessage)

export default router
