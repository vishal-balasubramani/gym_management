import express from 'express'
import { protect } from '../middleware/auth.js'
import { 
    getTraineeStats, 
    completeProfile, 
    getMyWorkoutPlan,
    getMyDietPlan,
    getAttendanceHistory,
    getProgressHistory,      // ✅ NEW
    addProgressEntry,
    getAvailableSessions,
    bookSession,
    getMyBookings,
    getMyTrainerChatList,
    getMessages,
    sendMessage,
    getTraineeMessages
} from '../controllers/traineeController.js'
import { 
    getPlans, 
    createOrder, 
    verifyPayment 
} from '../controllers/paymentController.js'
import checkFeature from '../middleware/checkFeature.js'; // ✅ Imported and now used below

const router = express.Router()

// --- Trainee Profile Routes ---
router.post('/complete-profile', protect, completeProfile)

// --- Dashboard & Features Routes ---
// Stats are public to any logged-in trainee
router.get('/dashboard-stats', protect, getTraineeStats)

// Only allow if user's plan has "Workout Plan" in features list
router.get('/my-plan', protect, getMyWorkoutPlan)

// Only allow if user's plan has "Diet Plan" in features list
router.get('/my-diet', protect, checkFeature('Diet Plan'), getMyDietPlan)

// Attendance is usually basic access, but you can gate it if needed
router.get('/my-attendance', protect, getAttendanceHistory) 

// --- Payment Routes ---
router.get('/plans', protect, getPlans)
router.post('/create-order', protect, createOrder)
router.post('/verify-payment', protect, verifyPayment)

router.get('/my-progress', protect, getProgressHistory)
router.post('/my-progress', protect, addProgressEntry)

router.get('/available-sessions', protect, getAvailableSessions)
router.post('/book-session', protect, bookSession)
router.get('/my-bookings', protect, getMyBookings)

// Add these to traineeRoutes.js
router.get('/messages/trainers', protect, getMyTrainerChatList);
router.get('/messages/:trainerUserId', protect, getTraineeMessages);
router.post('/messages/send', protect, sendMessage); // Use the same sendMessage function as trainer/ You can reuse the existing sendMessage logic

export default router
