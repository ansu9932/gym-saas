export const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

export const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});

export const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));
export const formatDate = (value) => dateFormatter.format(new Date(value));
export const formatDateTime = (value) => dateTimeFormatter.format(new Date(value));

export const formatDaysLeft = (daysLeft) => {
  if (daysLeft < 0) {
    return `${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"} overdue`;
  }

  if (daysLeft === 0) {
    return "Expires today";
  }

  return `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
};
