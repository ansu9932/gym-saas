import express from "express";
const router = express.Router();

router.post("/send-link", async (req, res) => {
  const { member } = req.body;

  const paymentLink = `http://localhost:5173/pay/${member._id}`;

  // 📧 send email
  await sendEmail({
    to: member.email,
    subject: "Renew Your Membership",
    html: `
      <h2>Hello ${member.fullName}</h2>
      <p>Your membership is expiring.</p>
      <a href="${paymentLink}" style="padding:10px 20px;background:red;color:white;">
        Pay Now
      </a>
    `
  });

  res.json({ success: true });
});

export default router;
