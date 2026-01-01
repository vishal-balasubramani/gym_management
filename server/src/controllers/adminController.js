import pool from '../config/database.js'
import bcrypt from 'bcryptjs'
import { generatePassword } from '../utils/passwordGenerator.js'
import { sendWelcomeEmail } from '../config/email.js'

// ==================== DASHBOARD STATS ====================

export const getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await pool.query("SELECT COUNT(*) FROM users WHERE role IN ('member', 'trainee')");
    const activeTrainers = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'trainer'");
    
    // Using 'created_at' from your payments schema
    const monthlyRevenue = await pool.query(
      `SELECT COALESCE(SUM(CAST(amount AS NUMERIC)), 0) as total 
       FROM payments 
       WHERE status = 'success' 
       AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)`
    );

    const newMembers = await pool.query("SELECT COUNT(*) FROM users WHERE role IN ('member', 'trainee') AND created_at >= NOW() - INTERVAL '7 days'");
    const activeMemberships = await pool.query("SELECT COUNT(*) FROM memberships WHERE status = 'active'");
    
    // CORRECTED: Table name is 'attendance' (singular) and uses 'trainee_id'
    const todayAttendance = await pool.query("SELECT COUNT(DISTINCT trainee_id) FROM attendance WHERE date::date = CURRENT_DATE");

    res.json({
      success: true,
      stats: {
        totalMembers: parseInt(totalMembers.rows[0]?.count || 0),
        activeTrainers: parseInt(activeTrainers.rows[0]?.count || 0),
        monthlyRevenue: parseFloat(monthlyRevenue.rows[0]?.total || 0),
        newMembers: parseInt(newMembers.rows[0]?.count || 0),
        activeMemberships: parseInt(activeMemberships.rows[0]?.count || 0),
        todayAttendance: parseInt(todayAttendance.rows[0]?.count || 0)
      }
    });
  } catch (error) {
    console.error('DATABASE ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching stats', error: error.message });
  }
};

// ==================== MEMBERS ====================

export const getAllMembers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at, u.profile_image,
        t.current_weight, t.height, t.bmi, t.fitness_goal,
        m.plan_type, m.status as membership_status, m.start_date, m.end_date,
        tr_user.name as trainer_name
      FROM users u
      LEFT JOIN trainees t ON u.id = t.user_id
      LEFT JOIN memberships m ON u.id = m.user_id AND m.status = 'active'
      LEFT JOIN trainers tr ON t.trainer_id = tr.id
      LEFT JOIN users tr_user ON tr.user_id = tr_user.id
      WHERE u.role IN ('trainee', 'member')
      ORDER BY u.created_at DESC
    `);
    res.json({ success: true, members: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.*, t.current_weight, t.height, t.bmi, t.fitness_goal, t.trainer_id,
      m.plan_type, m.status as membership_status
      FROM users u
      LEFT JOIN trainees t ON u.id = t.user_id
      LEFT JOIN memberships m ON u.id = m.user_id
      WHERE u.id = $1`, [req.params.id]);
    res.json({ success: true, member: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

export const addMember = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, email, phone, current_weight, height, fitness_goal, trainer_id } = req.body;
    await client.query('BEGIN');
    const plainPassword = generatePassword(12);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const userRes = await client.query(`INSERT INTO users (name, email, phone, password, role) VALUES ($1, $2, $3, $4, 'trainee') RETURNING id`, [name, email, phone, hashedPassword]);
    const heightM = height / 100;
    const bmi = (current_weight / (heightM * heightM)).toFixed(2);
    await client.query(`INSERT INTO trainees (user_id, current_weight, height, bmi, fitness_goal, trainer_id, status) VALUES ($1, $2, $3, $4, $5, $6, 'active')`, [userRes.rows[0].id, current_weight, height, bmi, fitness_goal, trainer_id]);
    await client.query('COMMIT');
    sendWelcomeEmail(email, name, plainPassword);
    res.status(201).json({ success: true });
  } catch (error) { await client.query('ROLLBACK'); res.status(500).json({ error: error.message }); } finally { client.release(); }
};

export const updateMember = async (req, res) => {
  try {
    const { name, email, phone, current_weight, height, fitness_goal, trainer_id } = req.body;
    await pool.query('UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4', [name, email, phone, req.params.id]);
    const heightM = height / 100;
    const bmi = (current_weight / (heightM * heightM)).toFixed(2);
    await pool.query('UPDATE trainees SET current_weight=$1, height=$2, bmi=$3, fitness_goal=$4, trainer_id=$5 WHERE user_id=$6', [current_weight, height, bmi, fitness_goal, trainer_id, req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteMember = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// ==================== TRAINERS ====================

export const getAllTrainers = async (req, res) => {
  try {
    const result = await pool.query('SELECT t.*, u.name, u.email, u.phone FROM trainers t JOIN users u ON t.user_id = u.id');
    res.json({ success: true, trainers: result.rows });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const addTrainer = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, email, phone, specialization, experience_years, bio } = req.body;
    await client.query('BEGIN');
    const plainPassword = generatePassword(12);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const userRes = await client.query(`INSERT INTO users (name, email, phone, password, role) VALUES ($1, $2, $3, $4, 'trainer') RETURNING id`, [name, email, phone, hashedPassword]);
    await client.query(`INSERT INTO trainers (user_id, specialization, experience_years, bio) VALUES ($1, $2, $3, $4)`, [userRes.rows[0].id, specialization, experience_years, bio]);
    await client.query('COMMIT');
    sendWelcomeEmail(email, name, plainPassword);
    res.status(201).json({ success: true });
  } catch (error) { await client.query('ROLLBACK'); res.status(500).json({ error: error.message }); } finally { client.release(); }
};

export const updateTrainer = async (req, res) => {
  try {
    const { name, specialization, experience_years, bio } = req.body;
    await pool.query('UPDATE users SET name=$1 WHERE id=$2', [name, req.params.id]);
    await pool.query('UPDATE trainers SET specialization=$1, experience_years=$2, bio=$3 WHERE user_id=$4', [specialization, experience_years, bio, req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteTrainer = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const assignTrainer = async (req, res) => {
  try {
    await pool.query('UPDATE trainees SET trainer_id = $1 WHERE user_id = $2', [req.body.trainer_id, req.body.member_id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// ==================== PAYMENTS ====================

export const getRecentPayments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name as user_name, u.email 
      FROM payments p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, payments: result.rows });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const addPayment = async (req, res) => {
  try {
    const { userId, amount, paymentMethod, transactionId } = req.body;
    await pool.query('INSERT INTO payments (user_id, amount, payment_method, transaction_id, status) VALUES ($1, $2, $3, $4, $5)', [userId, amount, paymentMethod, transactionId, 'success']);
    res.status(201).json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// ==================== SESSIONS ====================

export const getAllSessions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, ut.name as trainer_name, um.name as trainee_name 
      FROM sessions s 
      JOIN trainers t ON s.trainer_id = t.id JOIN users ut ON t.user_id = ut.id
      JOIN trainees tr ON s.trainee_id = tr.id JOIN users um ON tr.user_id = um.id`);
    res.json({ success: true, sessions: result.rows });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const createSession = async (req, res) => {
  try {
    const { trainerId, traineeId, sessionDate, sessionTime, notes } = req.body;
    await pool.query('INSERT INTO sessions (trainer_id, trainee_id, session_date, session_time, status, notes) VALUES ($1, $2, $3, $4, $5, $6)', [trainerId, traineeId, sessionDate, sessionTime, 'upcoming', notes]);
    res.status(201).json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// ==================== ATTENDANCE ====================

export const getTodayAttendance = async (req, res) => {
  try {
    const result = await pool.query('SELECT a.*, u.name FROM attendance a JOIN trainees t ON a.trainee_id = t.id JOIN users u ON t.user_id = u.id WHERE a.date = CURRENT_DATE');
    res.json({ success: true, attendance: result.rows });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const getAllAttendance = async (req, res) => {
  try {
    const result = await pool.query('SELECT a.*, u.name FROM attendance a JOIN trainees t ON a.trainee_id = t.id JOIN users u ON t.user_id = u.id ORDER BY a.date DESC');
    res.json({ success: true, attendance: result.rows });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const markAttendance = async (req, res) => {
  try {
    await pool.query('INSERT INTO attendance (trainee_id, date, status) VALUES ($1, CURRENT_DATE, $2)', [req.body.traineeId, req.body.status]);
    res.status(201).json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// ==================== MEMBERSHIPS ====================

export const getAllMemberships = async (req, res) => {
  try {
    const result = await pool.query('SELECT m.*, u.name FROM memberships m JOIN users u ON m.user_id = u.id');
    res.json({ success: true, memberships: result.rows });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const createMembership = async (req, res) => {
  try {
    const { userId, planType, startDate, endDate, price } = req.body;
    await pool.query('INSERT INTO memberships (user_id, plan_type, start_date, end_date, price, status) VALUES ($1, $2, $3, $4, $5, $6)', [userId, planType, startDate, endDate, price, 'active']);
    res.status(201).json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateMembershipStatus = async (req, res) => {
  try {
    await pool.query('UPDATE memberships SET status = $1 WHERE id = $2', [req.body.status, req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// ==================== REPORTS ====================

export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    // FIXED: Changed 'total' to 'total_revenue' to match frontend state logic
    const result = await pool.query(`
      SELECT DATE(created_at) as date, 
             SUM(CAST(amount AS NUMERIC)) as total_revenue, 
             COUNT(*) as total_payments
      FROM payments 
      WHERE status = 'success' 
      AND created_at BETWEEN $1 AND $2
      GROUP BY DATE(created_at) 
      ORDER BY date ASC
    `, [startDate, endDate]);
    
    res.json({ success: true, report: result.rows });
  } catch (error) { 
    console.error('Revenue Report Error:', error);
    res.status(500).json({ error: error.message }); 
  }
};

export const getMembershipReport = async (req, res) => {
  try {
    // FIXED: Added conditional counts for active/expired to populate the "Key Insights" section
    const result = await pool.query(`
      SELECT plan_type, 
             COUNT(*) as total_members,
             COUNT(CASE WHEN status = 'active' THEN 1 END) as active_members,
             COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_members
      FROM memberships 
      GROUP BY plan_type
    `);
    res.json({ success: true, report: result.rows });
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};