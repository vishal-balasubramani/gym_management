export const createSession = async (req, res) => {
  const { trainerId, traineeId, sessionDate, sessionTime, durationMinutes, notes } = req.body;

  try {
    // 1. CHECK FOR CONFLICTS (The Double Booking Prevention)
    // "Select any active session for this trainer on this date at this time"
    const conflictCheck = await pool.query(
      `SELECT * FROM sessions 
       WHERE trainer_id = $1 
       AND session_date = $2 
       AND session_time = $3 
       AND status != 'cancelled'`, // Ignore cancelled sessions
      [trainerId, sessionDate, sessionTime]
    );

    if (conflictCheck.rows.length > 0) {
      // ❌ Trainer is already booked!
      return res.status(400).json({ 
        success: false, 
        message: 'This Trainer is already booked at this time. Please choose another slot.' 
      });
    }

    // 2. CHECK IF TRAINEE IS BUSY (Optional but good practice)
    const traineeConflict = await pool.query(
        `SELECT * FROM sessions 
         WHERE trainee_id = $1 
         AND session_date = $2 
         AND session_time = $3 
         AND status != 'cancelled'`,
        [traineeId, sessionDate, sessionTime]
    );

    if (traineeConflict.rows.length > 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'You already have a session scheduled at this time.' 
        });
    }

    // 3. IF NO CONFLICT, PROCEED TO INSERT
    const newSession = await pool.query(
      `INSERT INTO sessions (trainer_id, trainee_id, session_date, session_time, duration_minutes, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'scheduled')
       RETURNING *`,
      [trainerId, traineeId, sessionDate, sessionTime, durationMinutes || 60, notes]
    );

    res.status(201).json({ success: true, session: newSession.rows[0] });

  } catch (error) {
    console.error('Create Session Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
