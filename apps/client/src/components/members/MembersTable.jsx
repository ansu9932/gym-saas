import { Eye, PencilLine, QrCode, RefreshCcw, Trash2 } from "lucide-react";
import { resolveAssetUrl } from "../../api/client";
import { formatCurrency, formatDate, formatDaysLeft } from "../../utils/formatters";
import { paymentMeta, statusMeta } from "../../utils/status";
import StatusBadge from "../ui/StatusBadge";

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const MembersTable = ({
  members,
  canDelete,
  onEdit,
  onRenew,
  onDelete,
  onViewQr
}) => (
  <div className="overflow-hidden rounded-[24px] border border-white/10">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
          <tr>
            <th className="px-4 py-4">Member</th>
            <th className="px-4 py-4">Plan</th>
            <th className="px-4 py-4">Period</th>
            <th className="px-4 py-4">Payment</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {members.map((member) => (
            <tr key={member._id} className="transition hover:bg-white/[0.03]">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  {member.profilePhotoUrl ? (
                    <img
                      src={resolveAssetUrl(member.profilePhotoUrl)}
                      alt={member.fullName}
                      className="h-12 w-12 rounded-2xl border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#FF3B3B]/25 to-[#FF7A00]/15 font-semibold text-[#ffd3c1]">
                      {getInitials(member.fullName)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[color:var(--text)]">{member.fullName}</p>
                    <p className="text-[color:var(--muted)]">{member.phoneNumber}</p>
                    {member.email ? (
                      <p className="text-xs text-[color:var(--muted)]/80">{member.email}</p>
                    ) : null}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <p className="font-medium text-[color:var(--text)]">{member.planName}</p>
                <p className="text-[color:var(--muted)]">{formatCurrency(member.amountPaid || member.price)}</p>
              </td>
              <td className="px-4 py-4 text-[color:var(--muted)]">
                <p>{formatDate(member.startDate)}</p>
                <p>{formatDate(member.endDate)}</p>
                <p className="mt-1 text-xs text-[color:var(--text)]">{formatDaysLeft(member.daysLeft)}</p>
              </td>
              <td className="px-4 py-4">
                <StatusBadge
                  label={paymentMeta[member.paymentStatus]?.label || member.paymentStatus}
                  tone={paymentMeta[member.paymentStatus]?.className || paymentMeta.unpaid.className}
                />
              </td>
              <td className="px-4 py-4">
                <StatusBadge
                  label={statusMeta[member.status]?.label || member.status}
                  tone={statusMeta[member.status]?.className || statusMeta.expired.className}
                />
              </td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <button className="icon-button" type="button" onClick={() => onEdit(member)}>
                    <PencilLine className="h-4 w-4" />
                  </button>
                  <button className="icon-button" type="button" onClick={() => onRenew(member)}>
                    <RefreshCcw className="h-4 w-4" />
                  </button>
                  <button className="icon-button" type="button" onClick={() => onViewQr(member)}>
                    <QrCode className="h-4 w-4" />
                  </button>
                  {canDelete ? (
                    <button className="icon-button" type="button" onClick={() => onDelete(member)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <button className="icon-button" type="button" onClick={() => onEdit(member)}>
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default MembersTable;
