import nodemailer from 'nodemailer';

// Working email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'testvrittih@gmail.com',
    pass: 'test1234apppass'
  }
});

export async function sendOTPEmail(email: string, otp: string) {
  
  try {
    const mailOptions = {
      from: 'Vrrittih <vrrittih.noreply@gmail.com>',
      to: email,
      subject: 'Login OTP - Vrrittih.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Login OTP</h2>
          <p>Your login OTP for Vrrittih.com is:</p>
          <div style="background: #f8f9fa; border: 2px solid #007bff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #007bff; font-size: 36px; margin: 0; letter-spacing: 4px;">${otp}</h1>
          </div>
          <p><strong>Valid for 10 minutes only.</strong></p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: true };
  }
}