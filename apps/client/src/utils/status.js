export const statusMeta = {
  active: {
    label: "Active",
    className:
      "border-emerald-400/30 bg-emerald-500/10 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.12)]"
  },
  expiring: {
    label: "Expiring Soon",
    className:
      "border-amber-400/30 bg-amber-500/10 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.12)]"
  },
  expired: {
    label: "Expired",
    className:
      "border-rose-400/30 bg-rose-500/10 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.14)]"
  }
};

export const paymentMeta = {
  paid: {
    label: "Paid",
    className: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100"
  },
  partial: {
    label: "Partial",
    className: "border-orange-400/30 bg-orange-500/10 text-orange-100"
  },
  unpaid: {
    label: "Unpaid",
    className: "border-zinc-400/30 bg-zinc-500/10 text-zinc-200"
  }
};
