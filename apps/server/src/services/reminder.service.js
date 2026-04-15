import cron from "node-cron";
import dayjs from "dayjs";
import { env } from "../config/env.js";
import { Member } from "../models/Member.js";
import { buildReminderEmail } from "../utils/emailTemplates.js";
import { getDaysLeft } from "../utils/membership.js";
import { createNotification } from "./notification.service.js";
import { sendEmail } from "./email.service.js";
import { sendWhatsappReminder } from "./whatsapp.service.js";

export const processMembershipReminders = async () => {
  const today = dayjs().startOf("day");
  const candidates = await Member.find({
    endDate: {
      $gte: today.toDate(),
      $lte: today.add(3, "day").endOf("day").toDate()
    }
  }).populate("gym");

  for (const member of candidates) {
    const daysLeft = getDaysLeft(member.endDate);
    const gym = member.gym;

    if (!gym) {
      continue;
    }

    if (daysLeft === 3 && !member.reminders?.threeDaySentAt) {
      const payload = buildReminderEmail({
        gym,
        member,
        type: "three-day"
      });

      if (member.email) {
        await sendEmail({ to: member.email, ...payload });
      }

      await sendWhatsappReminder({ gym, member, type: "three-day" });
      await createNotification({
        gymId: gym._id,
        memberId: member._id,
        type: "membership-expiring",
        title: `${member.fullName} expires in 3 days`,
        message: `${member.fullName}'s ${member.planName} membership ends in 3 days.`,
        metadata: {
          endDate: member.endDate,
          phoneNumber: member.phoneNumber
        }
      });

      member.reminders = {
        ...member.reminders,
        threeDaySentAt: new Date()
      };
      await member.save();
    }

    if (daysLeft === 0 && !member.reminders?.expiryDaySentAt) {
      const payload = buildReminderEmail({
        gym,
        member,
        type: "expiry-day"
      });

      if (member.email) {
        await sendEmail({ to: member.email, ...payload });
      }

      await sendWhatsappReminder({ gym, member, type: "expiry-day" });
      await createNotification({
        gymId: gym._id,
        memberId: member._id,
        type: "membership-expired",
        title: `${member.fullName} expires today`,
        message: `${member.fullName}'s membership expires today. Follow up for renewal.`,
        metadata: {
          endDate: member.endDate
        }
      });

      member.reminders = {
        ...member.reminders,
        expiryDaySentAt: new Date()
      };
      await member.save();
    }
  }
};

export const startReminderJob = () =>
  cron.schedule(
    "0 9 * * *",
    () => {
      processMembershipReminders().catch((error) => {
        console.error("Membership reminder job failed", error);
      });
    },
    {
      timezone: env.timezone
    }
  );
