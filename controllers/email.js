const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});




async function sendMail(to, subject, text) {
  const otp = text.match(/\d+/)?.[0]; 

  return transporter.sendMail({
    from: `"Team Threads Clone" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text, 
    html: `
      <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
        <div style="max-width:500px; margin:auto; background:#fff; padding:20px; border-radius:8px; text-align:center;">
          
          <h2 style="margin-bottom:10px;">Threads Clone</h2>
          
          <p style="color:#555;">Your OTP Code</p>
          
          <div style="font-size:28px; font-weight:bold; letter-spacing:6px; margin:20px 0;">
            ${otp || ""}
          </div>
          
          <p style="color:#777; font-size:14px;">
            This code will expire in 5 minutes.
          </p>

          <hr style="margin:20px 0;" />

          <p style="font-size:12px; color:#999;">
            If you didn’t request this, please ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}

module.exports = sendMail;