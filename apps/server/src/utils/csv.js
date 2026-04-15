import { stringify } from "csv-stringify/sync";
import { buildMemberStatus } from "./membership.js";

export const buildMembersCsv = (members) =>
  stringify(
    members.map((member) => {
      const { status, daysLeft } = buildMemberStatus(member);

      return {
        "Full Name": member.fullName,
        Phone: member.phoneNumber,
        Email: member.email || "",
        Plan: member.planName || member.membershipPlan?.name || "",
        "Start Date": new Date(member.startDate).toISOString().slice(0, 10),
        "End Date": new Date(member.endDate).toISOString().slice(0, 10),
        "Days Left": daysLeft,
        Status: status,
        "Payment Status": member.paymentStatus,
        Amount: member.amountPaid ?? member.price ?? 0
      };
    }),
    {
      header: true
    }
  );
