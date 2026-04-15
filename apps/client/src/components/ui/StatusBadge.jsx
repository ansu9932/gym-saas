const StatusBadge = ({ label, tone }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase ${tone}`}
  >
    {label}
  </span>
);

export default StatusBadge;
