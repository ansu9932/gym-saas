import dayjs from "dayjs";

export const MEMBERSHIP_STATUSES = {
  ACTIVE: "active",
  EXPIRING: "expiring",
  EXPIRED: "expired"
};

export const EXPIRING_SOON_DAYS = 5;

export const getDaysLeft = (endDate) =>
  dayjs(endDate).startOf("day").diff(dayjs().startOf("day"), "day");

export const getMembershipStatus = (endDate) => {
  const daysLeft = getDaysLeft(endDate);

  if (daysLeft < 0) {
    return MEMBERSHIP_STATUSES.EXPIRED;
  }

  if (daysLeft < EXPIRING_SOON_DAYS) {
    return MEMBERSHIP_STATUSES.EXPIRING;
  }

  return MEMBERSHIP_STATUSES.ACTIVE;
};

export const buildStatusQuery = (status) => {
  const today = dayjs().startOf("day");

  switch (status) {
    case MEMBERSHIP_STATUSES.ACTIVE:
      return {
        endDate: { $gte: today.add(EXPIRING_SOON_DAYS, "day").toDate() }
      };
    case MEMBERSHIP_STATUSES.EXPIRING:
      return {
        endDate: {
          $gte: today.toDate(),
          $lte: today.add(EXPIRING_SOON_DAYS - 1, "day").endOf("day").toDate()
        }
      };
    case MEMBERSHIP_STATUSES.EXPIRED:
      return {
        endDate: { $lt: today.toDate() }
      };
    default:
      return {};
  }
};

export const buildMemberStatus = (member) => {
  const daysLeft = getDaysLeft(member.endDate);
  const status = getMembershipStatus(member.endDate);

  return {
    daysLeft,
    status
  };
};

export const calculateEndDate = ({ startDate, durationDays }) =>
  dayjs(startDate).startOf("day").add(durationDays - 1, "day").toDate();

export const buildRenewedDates = ({ currentEndDate, durationDays }) => {
  const today = dayjs().startOf("day");
  const current = currentEndDate ? dayjs(currentEndDate).startOf("day") : today;
  const nextStart = current.isAfter(today) ? current.add(1, "day") : today;

  return {
    startDate: nextStart.toDate(),
    endDate: nextStart.add(durationDays - 1, "day").toDate()
  };
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);
