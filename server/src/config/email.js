import nodemailer from 'nodemailer'

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASSWORD // App Password (not regular password)
  }
})

// Send welcome email to new member
export const sendWelcomeEmail = async (memberEmail, memberName, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: memberEmail,
    subject: '🎉 Welcome to Fit Hub - Your Fitness Journey Starts Now!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; color: #333; }
          .credentials { background-color: #f8f8f8; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0; }
          .button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏋️ Welcome to Fit Hub!</h1>
          </div>
          <div class="content">
            <h2>Hello ${memberName}! 👋</h2>
            <p>Welcome to <strong>Fit Hub</strong> - Your ultimate fitness destination!</p>
            <p>Your account has been successfully created. Here are your login credentials:</p>
            
            <div class="credentials">
              <strong>📧 Email:</strong> ${memberEmail}<br>
              <strong>🔑 Password:</strong> <code>${password}</code>
            </div>
            
            <p><strong>⚠️ Important:</strong> Please change your password after your first login for security.</p>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Complete your professional profile to verify your credentials</li>
              <li>Find and connect with your assigned trainees</li>
              <li>Create workout and diet plans to guide their fitness journey!</li>
            </ul>
            
            <a href="http://localhost:5173/signin" class="button">Login Now 🚀</a>
            
            <p style="margin-top: 30px;">Need help? Contact us at <strong>${process.env.EMAIL_USER}</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 Fit Hub. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('✅ Welcome email sent to:', memberEmail)
    return true
  } catch (error) {
    console.error('❌ Email send error:', error)
    return false
  }
}

export default transporter
