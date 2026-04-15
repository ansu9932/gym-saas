import { CalendarCheck2, QrCode, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client";
import QrModal from "../components/attendance/QrModal";
import { resolveAssetUrl } from "../api/client";
import { formatDateTime } from "../utils/formatters";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [qrPayload, setQrPayload] = useState("");
  const [qrState, setQrState] = useState({
    open: false,
    memberName: "",
    qrDataUrl: "",
    qrValue: ""
  });

  const load = async () => {
    const [attendanceResponse, membersResponse] = await Promise.all([
      api.get("/attendance"),
      api.get("/members", {
        params: {
          page: 1,
          limit: 100
        }
      })
    ]);

    setRecords(attendanceResponse.data);
    setMembers(membersResponse.data.items);
  };

  useEffect(() => {
    load();
  }, []);

  const manualCheckIn = async () => {
    if (!selectedMemberId) {
      return;
    }

    await api.post("/attendance/check-in", {
      memberId: selectedMemberId
    });
    load();
  };

  const qrCheckIn = async () => {
    if (!qrPayload) {
      return;
    }

    await api.post("/attendance/check-in", {
      qrCodeValue: qrPayload
    });
    setQrPayload("");
    load();
  };

  const showQr = async () => {
    if (!selectedMemberId) {
      return;
    }

    const member = members.find((item) => item._id === selectedMemberId);
    const { data } = await api.get(`/attendance/${selectedMemberId}/qrcode`);

    setQrState({
      open: true,
      memberName: member?.fullName || "Member",
      qrDataUrl: data.qrDataUrl,
      qrValue: data.qrCodeValue
    });
  };

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="glass-panel rounded-[32px] border border-white/10 p-5">
          <div className="flex items-center gap-3">
            <ScanLine className="h-5 w-5 text-[#ff8f55]" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#ff9b84]">Attendance tools</p>
              <h3 className="mt-2 font-display text-3xl text-[color:var(--text)]">Check-in desk</h3>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="field">
              <span>Select Member</span>
              <select value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)}>
                <option value="">Choose a member</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.fullName} • {member.planName}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="primary-button" onClick={manualCheckIn}>
                <CalendarCheck2 className="h-4 w-4" />
                Manual Check-In
              </button>
              <button type="button" className="secondary-button" onClick={showQr}>
                <QrCode className="h-4 w-4" />
                Show QR
              </button>
            </div>
            <label className="field">
              <span>QR Payload</span>
              <textarea
                rows="4"
                placeholder="Paste or scan a member QR payload here"
                value={qrPayload}
                onChange={(event) => setQrPayload(event.target.value)}
              />
            </label>
            <button type="button" className="secondary-button" onClick={qrCheckIn}>
              <ScanLine className="h-4 w-4" />
              Check In via QR
            </button>
          </div>
        </article>

        <article className="glass-panel rounded-[32px] border border-white/10 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[#ff9b84]">Recent activity</p>
          <h3 className="mt-2 font-display text-3xl text-[color:var(--text)]">Attendance log</h3>
          <div className="mt-5 space-y-3">
            {records.map((record) => (
              <div key={record._id} className="flex items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  {record.member?.profilePhotoUrl ? (
                    <img
                      src={resolveAssetUrl(record.member.profilePhotoUrl)}
                      alt={record.member?.fullName}
                      className="h-12 w-12 rounded-2xl border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#FF3B3B]/25 to-[#FF7A00]/15 font-semibold text-[#ffd3c1]">
                      {getInitials(record.member?.fullName)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[color:var(--text)]">{record.member?.fullName}</p>
                    <p className="text-sm text-[color:var(--muted)]">{record.member?.phoneNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#ffb07a]">{record.source}</p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">{formatDateTime(record.checkedInAt)}</p>
                </div>
              </div>
            ))}
            {!records.length ? (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-[color:var(--muted)]">
                Check-in history will appear here after the first attendance scan.
              </div>
            ) : null}
          </div>
        </article>
      </section>

      <QrModal
        open={qrState.open}
        onClose={() => setQrState((previous) => ({ ...previous, open: false }))}
        memberName={qrState.memberName}
        qrDataUrl={qrState.qrDataUrl}
        qrValue={qrState.qrValue}
      />
    </div>
  );
};

export default AttendancePage;
