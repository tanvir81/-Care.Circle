import nodemailer from "nodemailer";

export const sendInvoiceEmail = async (userEmail, bookingData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"Care.Circle" <noreply@carecircle.com>',
    to: userEmail,
    subject: "Booking Invoice - Care.Circle",
    text: `Your booking for ${bookingData.serviceName} is confirmed. Total Cost: $${bookingData.totalCost}. Duration: ${bookingData.duration} hrs.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb;">Care.Circle Invoice</h2>
        <p>Dear Customer, your booking has been received.</p>
        <hr />
        <p><strong>Service:</strong> ${bookingData.serviceName}</p>
        <p><strong>Duration:</strong> ${bookingData.duration} Hours</p>
        <p><strong>Total Cost:</strong> $${bookingData.totalCost}</p>
        <p><strong>Status:</strong> Pending Confirmation</p>
        <hr />
        <p style="font-size: 12px; color: #777;">Thank you for choosing Care.Circle!</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Invoice email sent");
  } catch (error) {
    console.error("Email failed:", error);
  }
};
