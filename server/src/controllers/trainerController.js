import pool from '../config/database.js'

// --- HELPER: Get Trainer ID (Auto-Creates Profile if Missing) ---


// ==================== DASHBOARD STATS ====================

export const getTrainerStats = async (req, res) => {
  try {
    const tid = await getTrainerId(req.user.id)

    const traineesCount = await pool.query(
      "SELECT COUNT(*) FROM trainees WHERE trainer_id = $1 AND status = 'active'", [tid]
    )
    
    const sessionsCount = await pool.query(
      "SELECT COUNT(*) FROM sessions WHERE trainer_id = $1 AND session_date = CURRENT_DATE", [tid]
    )

    const plansCount = await pool.query(
      "SELECT COUNT(*) FROM workout_plans WHERE trainer_id = $1", [tid]
    )

    const trainerInfo = await pool.query(
      "SELECT rating FROM trainers WHERE id = $1", [tid]
    )

    const recentSessionsRes = await pool.query(`
      SELECT s.id, s.session_time, s.status, s.notes, u.name as trainee_name
      FROM sessions s
      JOIN trainees t ON s.trainee_id = t.id
      JOIN users u ON t.user_id = u.id
      WHERE s.trainer_id = $1
      ORDER BY s.session_date DESC, s.session_time DESC
      LIMIT 5
    `, [tid])

    res.json({
      success: true,
      stats: {
        assignedTrainees: parseInt(traineesCount.rows[0].count),
        todaySessions: parseInt(sessionsCount.rows[0]?.count || 0),
        plansCreated: parseInt(plansCount.rows[0].count),
        averageRating: parseFloat(trainerInfo.rows[0]?.rating || 0).toFixed(1), 
        recentSessions: recentSessionsRes.rows || []
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// ==================== TRAINEE MANAGEMENT ====================

const getTrainerId = async (userId) => {
  let result = await pool.query("SELECT id FROM trainers WHERE user_id = $1", [userId])
  if (result.rows.length === 0) {
    result = await pool.query(
      `INSERT INTO trainers (user_id, specialization, experience_years, bio) 
       VALUES ($1, 'General Fitness', 0, 'New Trainer') RETURNING id`, [userId]
    )
  }
  return result.rows[0].id
}

// ==================== TRAINEE MANAGEMENT ====================

// --- Get All Trainees with active BOOKED sessions ---
export const getMyTrainees = async (req, res) => {
  try {
    const tid = await getTrainerId(req.user.id);

    // FIXED: Added t.current_weight, t.height, t.fitness_goal to the SELECT statement
    const result = await pool.query(`
      SELECT DISTINCT 
        t.id, 
        t.current_weight, 
        t.height, 
        t.fitness_goal, 
        t.status,
        u.name, 
        u.email, 
        u.phone, 
        u.profile_picture, 
        m.plan_type
      FROM trainees t
      JOIN users u ON t.user_id = u.id
      JOIN sessions s ON t.id = s.trainee_id
      LEFT JOIN memberships m ON u.id = m.user_id AND m.status = 'active'
      WHERE s.trainer_id = $1 AND s.status = 'booked'
      ORDER BY u.name ASC
    `, [tid]);

    res.json({ 
      success: true, 
      activeTrainees: result.rows 
    });

  } catch (error) {
    console.error('Get My Trainees Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const handleTraineeRequest = async (req, res) => {
  const { sessionId, action } = req.body 
  try {
    const tid = await getTrainerId(req.user.id)

    if (action === 'accept') {
      const sessionInfo = await pool.query("SELECT session_date, session_time, trainee_id FROM sessions WHERE id = $1", [sessionId])
      if (sessionInfo.rowCount === 0) return res.status(404).json({ message: 'Session not found' })
      
      const { session_date, session_time, trainee_id } = sessionInfo.rows[0]

      // CAPACITY CHECK: Max 3 trainees per 1-hour slot [Business Requirement]
      const capacityCheck = await pool.query(
        `SELECT COUNT(*) FROM sessions 
         WHERE trainer_id = $1 AND session_date = $2 AND session_time = $3 AND status = 'booked'`,
        [tid, session_date, session_time]
      )

      if (parseInt(capacityCheck.rows[0].count) >= 3) {
        return res.status(400).json({ message: 'Slot full! Max 3 trainees allowed for this hour.' })
      }

      // Link Trainee to Trainer and update session status
      await pool.query("UPDATE sessions SET status = 'booked' WHERE id = $1", [sessionId])
      await pool.query("UPDATE trainees SET trainer_id = $1, status = 'active' WHERE id = $2", [tid, trainee_id])
      
      res.json({ success: true, message: 'Session accepted and Trainee connected!' })
    } else {
      await pool.query("UPDATE sessions SET status = 'cancelled' WHERE id = $1", [sessionId])
      res.json({ success: true, message: 'Request rejected.' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// ==================== SESSIONS & AUTO-DISCONNECT ====================

export const updateSessionStatus = async (req, res) => {
  try {
    const tid = await getTrainerId(req.user.id);
    const { session_id, status } = req.body; 

    // Update the record to 'deleted'
    const result = await pool.query(
      "UPDATE sessions SET status = $1 WHERE id = $2 AND trainer_id = $3 RETURNING trainee_id",
      [status, session_id, tid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Session not found." });
    }

    // Only disconnect the trainee if the trainer actually finished the session
    if (status === 'completed') {
      const traineeId = result.rows[0].trainee_id;
      await pool.query(
        "UPDATE trainees SET trainer_id = NULL, status = 'inactive' WHERE id = $1", 
        [traineeId]
      );
    }

    res.json({ success: true, message: `Session moved to ${status}.` });
  } catch (error) {
    console.error("SQL ERROR:", error.message); // This will show you exactly why it fails in your terminal
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTrainerSessions = async (req, res) => {
  try {
    const tid = await getTrainerId(req.user.id)
    const result = await pool.query(`
      SELECT s.id, s.session_date, s.session_time, s.status, s.notes, u.name as trainee_name, u.phone
      FROM sessions s
      JOIN trainees t ON s.trainee_id = t.id
      JOIN users u ON t.user_id = u.id
      WHERE s.trainer_id = $1
      ORDER BY 
        CASE WHEN s.status = 'pending' THEN 1 ELSE 2 END,
        s.session_date ASC, s.session_time ASC
    `, [tid]) 
    res.json({ sessions: result.rows })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
// ==================== WORKOUT PLANS ====================

export const getPlans = async (req, res) => {
  try {
    const tid = await getTrainerId(req.user.id)
    const result = await pool.query(
      "SELECT * FROM workout_plans WHERE trainer_id = $1 ORDER BY created_at DESC", [tid]
    )
    res.json({ success: true, plans: result.rows })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const createPlan = async (req, res) => {
  try {
    const tid = await getTrainerId(req.user.id)
    const { title, goal, difficulty, duration_weeks, description, trainee_id } = req.body
    const result = await pool.query(
      `INSERT INTO workout_plans (trainer_id, trainee_id, title, goal, difficulty, duration_weeks, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [tid, trainee_id || null, title, goal, difficulty, duration_weeks, description]
    )
    res.json({ success: true, plan: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const deletePlan = async (req, res) => {
  try {
    await pool.query("DELETE FROM workout_plans WHERE id = $1", [req.params.planId])
    res.json({ success: true, message: 'Plan deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// ==================== DIET PLANS ====================

// --- Get All Diet Plans ---
export const getDietPlans = async (req, res) => {
  try {
    const tid = await getTrainerId(req.user.id);
    // FIXED: Selecting all macro columns and joining trainee name
    const result = await pool.query(`
      SELECT dp.*, u.name as trainee_name 
      FROM diet_plans dp
      LEFT JOIN trainees t ON dp.trainee_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE dp.trainer_id = $1 
      ORDER BY dp.created_at DESC
    `, [tid]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Create New Diet Plan ---
// --- Create New Diet Plan (FIXED) ---
export const createDietPlan = async (req, res) => {
  const { trainee_id, title, goal, calories, protein, carbs, fats, description, end_date } = req.body;
  try {
    const tid = await getTrainerId(req.user.id);

    const result = await pool.query(
      `INSERT INTO diet_plans 
       (trainer_id, trainee_id, title, goal, daily_calories, protein, carbs, fats, description, start_date, end_date, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE, $10, 'active') 
       RETURNING *`,
      [tid, trainee_id, title, goal, calories, protein, carbs, fats, description, end_date || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Diet Plan Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDietPlan = async (req, res) => {
  try {
    const tid = await getTrainerId(req.user.id)
    await pool.query("DELETE FROM diet_plans WHERE id = $1 AND trainer_id = $2", [req.params.id, tid])
    res.json({ message: 'Diet plan deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}





// ==================== ATTENDANCE ====================

// --- Get Trainees for Attendance (Session-Aware) ---
export const getTraineesForAttendance = async (req, res) => {
  try {
    const tid = await getTrainerId(req.user.id);
    const result = await pool.query(`
      SELECT DISTINCT
        t.id as trainee_id, 
        u.name, 
        u.profile_picture,
        t.fitness_goal,
        t.height,               -- Explicitly pulling from trainees table
        t.current_weight,       -- Explicitly pulling from trainees table
        a.status as today_status,
        s.status as session_status
      FROM trainees t
      JOIN users u ON t.user_id = u.id
      JOIN sessions s ON t.id = s.trainee_id
      LEFT JOIN attendance a ON t.id = a.trainee_id AND a.date = CURRENT_DATE
      WHERE s.trainer_id = $1 
        AND s.session_date = CURRENT_DATE 
        AND s.status IN ('booked', 'completed')
      ORDER BY u.name ASC
    `, [tid]);

    // Calculate BMI on the backend to keep frontend clean
    const traineesWithBMI = result.rows.map(trainee => {
      let bmi = "--";
      if (trainee.height && trainee.current_weight) {
        bmi = (trainee.current_weight / ((trainee.height / 100) ** 2)).toFixed(1);
      }
      return { ...trainee, bmi };
    });

    res.json(traineesWithBMI);
  } catch (error) {
    console.error("Attendance Fetch Error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
// --- Mark/Update Attendance ---
export const markAttendance = async (req, res) => {
  const { traineeId, status } = req.body; // 'present' or 'absent'
  try {
    const result = await pool.query(`
      INSERT INTO attendance (trainee_id, date, status)
      VALUES ($1, CURRENT_DATE, $2)
      ON CONFLICT (trainee_id, date) 
      DO UPDATE SET status = EXCLUDED.status
      RETURNING *
    `, [traineeId, status]);
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== PROGRESS ====================

export const getTraineeProgress = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM progress_tracking WHERE trainee_id = $1 ORDER BY date ASC", 
      [req.params.traineeId]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const addProgressEntry = async (req, res) => {
  try {
    const { traineeId, date, weight, chest, waist, hips, notes } = req.body
    const result = await pool.query(
      `INSERT INTO progress_tracking (trainee_id, date, weight, chest, waist, hips, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [traineeId, date, weight, chest, waist, hips, notes]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// ==================== MESSAGING ====================

export const getChatList = async (req, res) => {
  try {
    const tid = await getTrainerId(req.user.id);
    
    // UPDATED QUERY: Finds all trainees who have had a session with you
    // This keeps them in the chat list even after the session is 'completed'
    const result = await pool.query(`
      SELECT DISTINCT 
        u.id as user_id, 
        u.name, 
        u.profile_picture, 
        t.id as trainee_id
      FROM users u
      JOIN trainees t ON u.id = t.user_id
      JOIN sessions s ON t.id = s.trainee_id
      WHERE s.trainer_id = $1 AND s.status IN ('booked', 'completed')
      ORDER BY u.name ASC
    `, [tid]);

    res.json(result.rows);
  } catch (error) {
    console.error("Chat List Error:", error);
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


// --- Create New Workout Plan ---
export const createWorkoutPlan = async (req, res) => {
  const { trainee_id, title, goal, description, end_date } = req.body;
  try {
    const tid = await getTrainerId(req.user.id);
    const result = await pool.query(
      `INSERT INTO workout_plans 
       (trainer_id, trainee_id, title, goal, description, start_date, end_date, status) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $6, 'active') 
       RETURNING *`,
      [tid, trainee_id, title, goal, description, end_date || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Workout Plan Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Get All Workout Plans ---
export const getWorkoutPlans = async (req, res) => {
  try {
    const tid = await getTrainerId(req.user.id);
    const result = await pool.query(`
      SELECT wp.*, u.name as trainee_name 
      FROM workout_plans wp
      LEFT JOIN trainees t ON wp.trainee_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE wp.trainer_id = $1 
      ORDER BY wp.created_at DESC
    `, [tid]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};