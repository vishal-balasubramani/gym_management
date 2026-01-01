import Razorpay from 'razorpay'
import crypto from 'crypto'
import pool from '../config/database.js'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Add these to your .env file
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// --- 1. Get Membership Plans ---
export const getPlans = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM membership_plans ORDER BY price ASC")
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching plans" })
  }
}

// --- 2. Create Order (Initiate Payment) ---
export const createOrder = async (req, res) => {
  const { planId } = req.body
  const userId = req.user.id

  try {
    // Fetch plan details
    const planRes = await pool.query("SELECT * FROM membership_plans WHERE id = $1", [planId])
    if (planRes.rowCount === 0) return res.status(404).json({ message: "Plan not found" })
    const plan = planRes.rows[0]

    const options = {
      amount: Math.round(plan.price * 100), // Forces integer

      currency: "INR",
      receipt: `receipt_user_${userId}_${Date.now()}`,
      notes: { plan_id: plan.id, user_id: userId }
    }

    const order = await razorpay.orders.create(options)
    res.json(order)

  } catch (error) {
    console.error("Razorpay Error:", error)
    res.status(500).json({ message: "Error creating order" })
  }
}

// --- 3. Verify Payment & Update Membership ---
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_id } = req.body
  const userId = req.user.id

  const body = razorpay_order_id + "|" + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex')

  if (expectedSignature === razorpay_signature) {
    // Payment Successful!
    try {
      // 1. Log Payment
      await pool.query(
        "INSERT INTO payments (user_id, amount, transaction_id, payment_method, status) VALUES ($1, $2, $3, $4, $5)",
        [userId, 0, razorpay_payment_id, 'Razorpay', 'success'] // You can fetch exact amount if needed
      )

      // 2. Fetch Plan Duration
      const planRes = await pool.query("SELECT duration_months, name FROM membership_plans WHERE id = $1", [plan_id])
      const plan = planRes.rows[0]

      // 3. Calculate Expiry Date
      const startDate = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + plan.duration_months)

      // 4. Update or Insert Membership
      // Using user_id as established
      await pool.query(`
        INSERT INTO memberships (user_id, plan_type, start_date, end_date, status) 
        VALUES ($1, $2, $3, $4, 'active')
        ON CONFLICT (user_id) DO UPDATE SET -- Assuming user_id is unique/primary key logic for membership, OR insert new row
        plan_type = EXCLUDED.plan_type,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        status = 'active'
      `, [userId, plan.name, startDate, endDate])

      // 5. Update Trainee Status if needed
      await pool.query("UPDATE trainees SET status = 'active' WHERE user_id = $1", [userId])

      res.json({ message: "Payment verified and membership activated!", status: "success" })

    } catch (error) {
      console.error("DB Error:", error)
      res.status(500).json({ message: "Payment verified but database update failed" })
    }
  } else {
    res.status(400).json({ message: "Invalid signature", status: "failed" })
  }
}
