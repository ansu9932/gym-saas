import dayjs from "dayjs";
import { env } from "../config/env.js";

export const sendWhatsappReminder = async ({ gym, member, type }) => {
  if (
    !env.whatsapp.enabled ||
    !env.whatsapp.apiUrl ||
    !env.whatsapp.apiToken ||
    !member.phoneNumber
  ) {
    return { skipped: true };
  }

  const response = await fetch(env.whatsapp.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.whatsapp.apiToken}`
    },
    body: JSON.stringify({
      to: member.phoneNumber,
      template: type === "expiry-day" ? "membership_expired" : "membership_expiring",
      variables: {
        memberName: member.fullName,
        gymName: gym.name,
        expiryDate: dayjs(member.endDate).format("DD MMM YYYY")
      }
    })
  });

  if (!response.ok) {
    throw new Error("WhatsApp reminder failed");
  }

  return { skipped: false };
};
