import pool from '../config/database.js'

// --- 1. Complete Profile ---
export const completeProfile = async (req, res) => {
  const { height, current_weight, fitness_goal } = req.body
  const userId = req.user.id 

  if (!height || !current_weight || !fitness_goal) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    const heightInMeters = height / 100
    if (heightInMeters <= 0) return res.status(400).json({ message: "Invalid height" })
        
    const bmi = (current_weight / (heightInMeters * heightInMeters)).toFixed(2)

    // Using user_id to link to users table
    const query = `
      INSERT INTO trainees (user_id, height, current_weight, fitness_goal, bmi, status, created_at) 
      VALUES ($1, $2, $3, $4, $5, 'active', NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        height = EXCLUDED.height,
        current_weight = EXCLUDED.current_weight,
        fitness_goal = EXCLUDED.fitness_goal,
        bmi = EXCLUDED.bmi
      RETURNING *;
    `

    const result = await pool.query(query, [userId, height, current_weight, fitness_goal, bmi])

    res.status(200).json({ message: "Profile saved", trainee: result.rows[0] })

  } catch (error) {
    console.error("Complete Profile Error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// --- 2. Get Trainee Stats ---
export const getTraineeStats = async (req, res) => {
  try {
    const userId = req.user.id
    
    // 1. Get Trainee ID (Crucial for other tables)
    const traineeRes = await pool.query("SELECT * FROM trainees WHERE user_id = $1", [userId])
    if (traineeRes.rowCount === 0) return res.status(404).json({ message: 'Trainee profile not found' })
    const trainee = traineeRes.rows[0]
    const traineeId = trainee.id

    // 2. Workouts (Using trainee_id based on your sessions screenshot)
    let workoutsCount = 0
    try {
        const wRes = await pool.query(
            "SELECT COUNT(*) FROM sessions WHERE trainee_id = $1 AND status = 'completed'", 
            [traineeId]
        )
        workoutsCount = parseInt(wRes.rows[0].count)
    } catch (e) {
        console.log("Sessions query failed (ignoring): " + e.message)
    }

    // 3. Membership (Using user_id based on your memberships screenshot)
    let memStatus = 'Inactive'
    let expiryDate = 'N/A'
    try {
        const mRes = await pool.query(
            "SELECT end_date, status FROM memberships WHERE user_id = $1 AND status = 'active' ORDER BY end_date DESC LIMIT 1", 
            [userId]
        )
        if (mRes.rowCount > 0) {
            memStatus = mRes.rows[0].status
            expiryDate = new Date(mRes.rows[0].end_date).toLocaleDateString()
        }
    } catch (e) {
        console.log("Membership query failed (ignoring): " + e.message)
    }

    // 4. Recent Sessions (Using trainee_id)
    let recentSessions = []
    try {
        const sRes = await pool.query(
            "SELECT session_date, session_time, status, notes FROM sessions WHERE trainee_id = $1 ORDER BY session_date DESC LIMIT 3", 
            [traineeId]
        )
        recentSessions = sRes.rows.map(s => ({
            title: s.notes || 'Workout Session',
            time: new Date(s.session_date).toLocaleDateString(),
            status: s.status,
            type: s.status === 'completed' ? 'completed' : 'upcoming'
        }))
    } catch (e) {
        console.log("Recent sessions query failed (ignoring): " + e.message)
    }

    // 5. BMI & Weight (From Trainee Profile)
    let bmi = 'N/A'
    if (trainee.height && trainee.current_weight) {
        const heightInMeters = trainee.height / 100
        bmi = (trainee.current_weight / (heightInMeters * heightInMeters)).toFixed(1)
    }

    // 6. Weight Change (From progress_tracking using trainee_id)
    let weightChange = 'Stable'
    try {
        const pRes = await pool.query(
            "SELECT weight FROM progress_tracking WHERE trainee_id = $1 ORDER BY date DESC LIMIT 2",
            [traineeId]
        )
        if (pRes.rowCount >= 2) {
            const diff = pRes.rows[0].weight - pRes.rows[1].weight
            weightChange = diff > 0 ? `+${diff.toFixed(1)}kg` : `${diff.toFixed(1)}kg`
        }
    } catch (e) {
        // ignore
    }

    res.json({
      stats: {
        workoutsCompleted: workoutsCount,
        workoutGoal: 20, 
        currentWeight: trainee.current_weight || 'N/A',
        weightChange: weightChange,
        bmi: bmi,
        bmiStatus: bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy' : 'Overweight',
        membershipStatus: memStatus,
        expiryDate: expiryDate,
        recentSessions: recentSessions
      }
    })

  } catch (error) {
    console.error("Stats Error:", error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getMyWorkoutPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get Trainee ID linked to user
    const traineeRes = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [userId]);
    if (traineeRes.rowCount === 0) return res.json({ plan: null });
    const traineeId = traineeRes.rows[0].id;

    // 2. Fetch the plan from workout_plans table
    // Removed strict expiry check so it's easier for you to see the data while testing
    const planRes = await pool.query(`
      SELECT id, title, goal, description, duration_weeks, created_at
      FROM workout_plans 
      WHERE trainee_id = $1 
      ORDER BY created_at DESC LIMIT 1
    `, [traineeId]);

    if (planRes.rowCount === 0) return res.json({ plan: null });

    const plan = planRes.rows[0];

    // 3. Simple End Date Calculation
    const startDate = new Date(plan.created_at);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (plan.duration_weeks * 7));

    // 4. Send response (mapping 'title' to 'name' for your JSX)
    res.json({
      plan: {
        id: plan.id,
        name: plan.title, 
        goal: plan.goal,
        description: plan.description,
        endDate: endDate.toISOString(),
        schedule: null // Using the fallback view in your JSX
      }
    });

  } catch (error) {
    console.error("WORKOUT_FETCH_ERROR:", error.message);
    res.status(500).json({ plan: null });
  }
};
export const getMyDietPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get Trainee ID linked to the logged-in User
    const traineeRes = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [userId]);
    
    if (traineeRes.rowCount === 0) {
      return res.json({ plan: null });
    }
    
    const traineeId = traineeRes.rows[0].id;

    // 2. Fetch the plan
    // Check if these column names match your DB: title, goal, daily_calories, protein, carbs, fats, description
    const planRes = await pool.query(`
      SELECT 
        id, 
        title, 
        goal, 
        daily_calories, 
        protein, 
        carbs, 
        fats, 
        description, 
        status, 
        end_date
      FROM diet_plans 
      WHERE trainee_id = $1 
        AND status = 'active' 
        AND (end_date IS NULL OR end_date >= CURRENT_DATE)
      ORDER BY created_at DESC LIMIT 1
    `, [traineeId]);

    if (planRes.rowCount === 0) {
      return res.json({ plan: null });
    }

    const row = planRes.rows[0];

    // 3. Return the data mapped for TraineeDietPlan.jsx
    res.json({
      plan: {
        id: row.id,
        title: row.title,
        goal: row.goal,
        calories: row.daily_calories, // Maps DB daily_calories to frontend calories
        protein: row.protein,
        carbs: row.carbs,
        fats: row.fats,
        description: row.description,
        schedule: null 
      }
    });

  } catch (error) {
    // THIS LOG IS KEY: Check your Node terminal for this output
    console.error("DATABASE_FETCH_ERROR:", error.message); 
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};
// --- 5. Get Attendance History ---
export const getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.id

    // 1. Get Trainee ID
    const traineeRes = await pool.query("SELECT id FROM trainees WHERE user_id = $1", [userId])
    if (traineeRes.rowCount === 0) return res.json({ history: [], stats: null })
    const traineeId = traineeRes.rows[0].id

    // 2. Fetch Attendance Records
    const attendanceRes = await pool.query(`
      SELECT * FROM attendance
      WHERE trainee_id = $1 
      ORDER BY date DESC
    `, [traineeId])

    const history = attendanceRes.rows

    // 3. Calculate Stats
    const totalDays = history.filter(a => a.status === 'present').length
    
    // Calculate This Month's Attendance
    const now = new Date()
    const thisMonth = history.filter(a => {
        const d = new Date(a.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && a.status === 'present'
    })

    res.json({
      history: history,
      stats: {
        totalPresent: totalDays,
        thisMonth: thisMonth.length,
        lastAttended: history.length > 0 ? history[0].date : null
      }
    })

  } catch (error) {
    console.error("Get Attendance Error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// --- 6. Get Progress History ---
export const getProgressHistory = async (req, res) => {
  try {
    const userId = req.user.id

    // Get trainee_id
    const traineeRes = await pool.query(
      'SELECT id FROM trainees WHERE user_id = $1',
      [userId]
    )
    if (traineeRes.rowCount === 0) {
      return res.json({ history: [] })
    }
    const traineeId = traineeRes.rows[0].id

    // Last 30 entries, newest first
    const progRes = await pool.query(
      `SELECT id, date, weight, chest, waist, hips, notes 
       FROM progress_tracking
       WHERE trainee_id = $1 
       ORDER BY date DESC, created_at DESC 
       LIMIT 30`,
      [traineeId]
    )

    res.json({ history: progRes.rows })
  } catch (error) {
    console.error('Get Progress Error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// --- 7. Add Progress Entry ---
export const addProgressEntry = async (req, res) => {
  try {
    const userId = req.user.id
    const { date, weight, chest, waist, hips, notes } = req.body

    if (!weight || !date) {
      return res.status(400).json({ message: 'Date and weight are required' })
    }

    const traineeRes = await pool.query(
      'SELECT id FROM trainees WHERE user_id = $1',
      [userId]
    )
    if (traineeRes.rowCount === 0) {
      return res.status(400).json({ message: 'Trainee profile not found' })
    }
    const traineeId = traineeRes.rows[0].id

    const insertRes = await pool.query(
      `INSERT INTO progress_tracking
        (trainee_id, date, weight, chest, waist, hips, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [traineeId, date, weight, chest || null, waist || null, hips || null, notes || null]
    )

    res.status(201).json({ message: 'Progress added', entry: insertRes.rows[0] })
  } catch (error) {
    console.error('Add Progress Error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
// --- 8. Get Available Sessions (FINAL FIXED VERSION) ---
export const getAvailableSessions = async (req, res) => {
  try {
    const userId = req.user.id
    
    // Get trainee_id (but we don't need it for this query anymore)
    const traineeRes = await pool.query(
      'SELECT id FROM trainees WHERE user_id = $1', [userId]
    )
    if (traineeRes.rowCount === 0) return res.json({ sessions: [] })

    const { date = new Date().toISOString().split('T')[0], time = '09:00' } = req.query

    // ✅ FIXED: Only $1=date, $2=time (removed unused trainee_id parameter)
    const sessionsRes = await pool.query(`
      SELECT 
        t.id as trainer_id, 
        u.name as trainer_name,
        $1 as session_date,
        $2 as session_time,
        COALESCE(session_counts.booked_slots, 0) as booked_slots
      FROM trainers t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN (
        SELECT 
          trainer_id,
          session_date,
          session_time,
          COUNT(*) as booked_slots
        FROM sessions 
        WHERE session_date = $1 
          AND session_time = $2
          AND status = 'booked'
        GROUP BY trainer_id, session_date, session_time
      ) session_counts ON t.id = session_counts.trainer_id
      WHERE (session_counts.booked_slots IS NULL OR session_counts.booked_slots < 3)
      ORDER BY u.name
    `, [date, time])  // ✅ Only 2 parameters now!

    res.json({ availableSessions: sessionsRes.rows })
  } catch (error) {
    console.error('Get Sessions Error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}


// --- 9. Book Session ---
export const bookSession = async (req, res) => {
  try {
    const userId = req.user.id
    const { trainer_id, session_date, session_time } = req.body

    // Get trainee_id
    const traineeRes = await pool.query(
      'SELECT id FROM trainees WHERE user_id = $1', [userId]
    )
    if (traineeRes.rowCount === 0) {
      return res.status(400).json({ message: 'Trainee profile not found' })
    }
    const traineeId = traineeRes.rows[0].id

    // Check if trainer exists
    const trainerCheck = await pool.query(
      'SELECT id FROM trainers WHERE id = $1', [trainer_id]
    )
    if (trainerCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Trainer not found' })
    }

    // Check if slot is full (3+ trainees)
    const slotCheck = await pool.query(`
      SELECT COUNT(*) as count 
      FROM sessions 
      WHERE trainer_id = $1 
      AND session_date = $2 
      AND session_time = $3 
      AND status = 'booked'
    `, [trainer_id, session_date, session_time])

    if (parseInt(slotCheck.rows[0].count) >= 3) {
      return res.status(400).json({ message: 'Session is full (max 3 trainees)' })
    }

    // Book the session
    const bookingRes = await pool.query(`
      INSERT INTO sessions (trainer_id, trainee_id, session_date, session_time, status)
      VALUES ($1, $2, $3, $4, 'booked')
      RETURNING *
    `, [trainer_id, traineeId, session_date, session_time])

    res.status(201).json({ 
      message: 'Session booked successfully!', 
      session: bookingRes.rows[0] 
    })
  } catch (error) {
    console.error('Book Session Error:', error)
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ message: 'Slot already booked for this trainer' })
    }
    res.status(500).json({ message: 'Server error' })
  }
}

// --- 10. Get My Bookings ---
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id
    
    const traineeRes = await pool.query(
      'SELECT id FROM trainees WHERE user_id = $1', [userId]
    )
    if (traineeRes.rowCount === 0) return res.json({ bookings: [] })
    const traineeId = traineeRes.rows[0].id

    const bookingsRes = await pool.query(`
      SELECT 
        s.id, s.session_date, s.session_time, s.status, s.notes,
        t.user_id as trainer_user_id, u.name as trainer_name
      FROM sessions s
      JOIN trainers t ON s.trainer_id = t.id
      JOIN users u ON t.user_id = u.id
      WHERE s.trainee_id = $1
      ORDER BY s.session_date DESC, s.session_time DESC
      LIMIT 20
    `, [traineeId])

    res.json({ bookings: bookingsRes.rows })
  } catch (error) {
    console.error('Get Bookings Error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}


// --- Get list of trainers the trainee has booked sessions with ---
// A. Get list of trainers you have booked sessions with
export const getMyTrainerChatList = async (req, res) => {
  try {
    const userId = req.user.id; // Logged in Trainee
    
    const result = await pool.query(`
      SELECT DISTINCT 
        u.id as user_id, 
        u.name, 
        u.profile_picture
      FROM users u
      JOIN trainers tr ON u.id = tr.user_id
      JOIN sessions s ON tr.id = s.trainer_id
      JOIN trainees t ON s.trainee_id = t.id
      WHERE t.user_id = $1
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// B. Fetch messages between Trainee and selected Trainer
export const getTraineeMessages = async (req, res) => {
  try {
    const myId = req.user.id;
    const trainerUserId = req.params.trainerUserId;

    const result = await pool.query(`
      SELECT * FROM messages 
      WHERE (sender_id = $1 AND receiver_id = $2) 
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC`, 
      [myId, trainerUserId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const getMessages = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM messages 
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC`, [req.user.id, req.params.userId])
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body
    const result = await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, receiverId, content]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
