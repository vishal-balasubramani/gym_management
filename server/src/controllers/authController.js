import pool from '../config/database.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'Please provide name, email, password and role' 
      })
    }

    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, created_at',
      [name, email, hashedPassword, phone, role]
    )

    const user = result.rows[0]

    // Create role-specific record
    if (role === 'trainer') {
      await pool.query(
        'INSERT INTO trainers (user_id, specialization, experience_years, rating, total_reviews) VALUES ($1, $2, $3, $4, $5)',
        [user.id, null, 0, 0, 0]
      )
    } else if (role === 'trainee') {
      await pool.query(
        'INSERT INTO trainees (user_id) VALUES ($1)',
        [user.id]
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    })
  }
}

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      })
    }

    // Check if user exists
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      })
    }

    const user = result.rows[0]

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_image: user.profile_image
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    })
  }
}

// Get Current User (Protected Route)
export const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const userId = req.user.id

    const result = await pool.query(
      'SELECT id, name, email, phone, role, profile_image, created_at FROM users WHERE id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'User not found' 
      })
    }

    const user = result.rows[0]

    // Get role-specific data
    let additionalData = {}

    if (user.role === 'trainer') {
      const trainerData = await pool.query(
        'SELECT specialization, experience_years, rating, total_reviews FROM trainers WHERE user_id = $1',
        [userId]
      )
      if (trainerData.rows.length > 0) {
        additionalData = trainerData.rows[0]
      }
    } else if (user.role === 'trainee') {
      const traineeData = await pool.query(
        'SELECT current_weight, height, bmi, fitness_goal FROM trainees WHERE user_id = $1',
        [userId]
      )
      if (traineeData.rows.length > 0) {
        additionalData = traineeData.rows[0]
      }

      // Get active membership
            // ✅ CORRECTED QUERY: JOIN using plan_type = p.name
      const membershipData = await pool.query(`
        SELECT m.plan_type, m.start_date, m.end_date, m.status, p.features 
        FROM memberships m
        JOIN membership_plans p ON m.plan_type = p.name 
        WHERE m.user_id = $1 AND m.status = 'active' 
        ORDER BY m.created_at DESC LIMIT 1
      `, [userId]
      )

      if (membershipData.rows.length > 0) {
        additionalData.membership = membershipData.rows[0]
      }
    }

    res.json({
      success: true,
      user: {
        ...user,
        ...additionalData
      }
    })
  } catch (error) {
    console.error('Get me error:', error)
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    })
  }
}

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { height, current_weight, fitness_goal } = req.body;

    // 1. Update contact info in public.users table
    

    // 2. Calculate BMI for better trainer visibility
    const bmi = (current_weight / ((height / 100) ** 2)).toFixed(1);

    // 3. Update physical metrics in trainees table
    await pool.query(
      `UPDATE trainees 
       SET height = $1, current_weight = $2, fitness_goal = $3, bmi = $4 
       WHERE user_id = $5`,
      [height, current_weight, fitness_goal, bmi, userId]
    );

    res.json({
      success: true,
      message: 'Profile and metrics updated successfully'
    });
  } catch (error) {
    console.error('Update Error:', error.message);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Please provide current and new password' 
      })
    }

    // Get current user
    const result = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    )

    const user = result.rows[0]

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Current password is incorrect' 
      })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, userId]
    )

    res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    })
  }
}
