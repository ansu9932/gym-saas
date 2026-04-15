import Modal from "../ui/Modal";

const QrModal = ({ open, onClose, memberName, qrDataUrl, qrValue }) => (
  <Modal
    open={open}
    onClose={onClose}
    title={`${memberName} QR pass`}
    description="Use this code for attendance check-ins from the scanner or manual QR input."
    width="max-w-md"
  >
    <div className="space-y-5 text-center">
      <div className="rounded-[24px] border border-white/10 bg-black/40 p-5">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt={`${memberName} QR code`} className="mx-auto h-72 w-72 rounded-2xl object-cover" />
        ) : (
          <div className="flex h-72 items-center justify-center rounded-2xl bg-white/5 text-[color:var(--muted)]">
            Loading QR...
          </div>
        )}
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-[color:var(--muted)]">
        {qrValue}
      </div>
    </div>
  </Modal>
);

export default QrModal;
