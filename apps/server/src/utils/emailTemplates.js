import dayjs from "dayjs";
import { formatCurrency } from "./membership.js";

export const buildReminderEmail = ({ gym, member, type }) => {
  const isExpiryDay = type === "expiry-day";
  const heading = isExpiryDay
    ? "Membership expiry reminder"
    : "Your membership is almost over";
  const copy = isExpiryDay
    ? `Your membership at ${gym.name} expires today. Renew now to keep uninterrupted access to training, classes, and attendance tracking.`
    : `Your membership at ${gym.name} will expire in 3 days. Renew now to avoid service interruption and keep your visits active.`;

  const subject = isExpiryDay
    ? `${gym.name}: Membership expires today`
    : `${gym.name}: Membership expires in 3 days`;

  const html = `
    <div style="background:#070707;padding:32px;font-family:Arial,Helvetica,sans-serif;color:#f7f7f7;">
      <div style="max-width:640px;margin:0 auto;background:linear-gradient(180deg,rgba(255,59,59,0.12),rgba(255,122,0,0.08));border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:32px;box-shadow:0 30px 80px rgba(0,0,0,0.35);">
        <p style="margin:0 0 12px;color:#ff916f;letter-spacing:0.18em;text-transform:uppercase;font-size:12px;">FlexBoard Reminder</p>
        <h1 style="margin:0 0 12px;font-size:30px;line-height:1.1;">${heading}</h1>
        <p style="margin:0 0 24px;color:#dadada;font-size:16px;line-height:1.7;">Hi ${member.fullName}, ${copy}</p>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:24px;">
          <div style="padding:16px;border-radius:18px;background:rgba(255,255,255,0.05);">
            <p style="margin:0 0 8px;color:#9a9a9a;font-size:12px;text-transform:uppercase;">Plan</p>
            <strong style="font-size:18px;">${member.planName}</strong>
          </div>
          <div style="padding:16px;border-radius:18px;background:rgba(255,255,255,0.05);">
            <p style="margin:0 0 8px;color:#9a9a9a;font-size:12px;text-transform:uppercase;">Expiry Date</p>
            <strong style="font-size:18px;">${dayjs(member.endDate).format("DD MMM YYYY")}</strong>
          </div>
          <div style="padding:16px;border-radius:18px;background:rgba(255,255,255,0.05);">
            <p style="margin:0 0 8px;color:#9a9a9a;font-size:12px;text-transform:uppercase;">Payment Status</p>
            <strong style="font-size:18px;text-transform:capitalize;">${member.paymentStatus}</strong>
          </div>
          <div style="padding:16px;border-radius:18px;background:rgba(255,255,255,0.05);">
            <p style="margin:0 0 8px;color:#9a9a9a;font-size:12px;text-transform:uppercase;">Amount</p>
            <strong style="font-size:18px;">${formatCurrency(member.amountPaid || member.price)}</strong>
          </div>
        </div>
        <a href="${gym.portalUrl || "#"}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:linear-gradient(135deg,#ff3b3b,#ff7a00);color:white;text-decoration:none;font-weight:700;">Renew Membership</a>
        <p style="margin:24px 0 0;color:#8f8f8f;font-size:13px;line-height:1.6;">This is an automated service email from ${gym.name}. If you have already renewed, please ignore this message.</p>
      </div>
    </div>
  `;

  return {
    subject,
    html,
    text: `${heading}\n\n${copy}\nPlan: ${member.planName}\nExpiry: ${dayjs(member.endDate).format("DD MMM YYYY")}`
  };
};
