import { useEffect, useState } from "react";
import Modal from "../ui/Modal";

const defaultValues = {
  fullName: "",
  phoneNumber: "",
  email: "",
  membershipPlan: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
  paymentStatus: "paid",
  amountPaid: "",
  notes: ""
};

const MemberFormModal = ({
  open,
  onClose,
  onSubmit,
  plans,
  initialValues,
  isSubmitting
}) => {
  const [form, setForm] = useState(defaultValues);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    if (open) {
      setForm(
        initialValues
          ? {
              fullName: initialValues.fullName || "",
              phoneNumber: initialValues.phoneNumber || "",
              email: initialValues.email || "",
              membershipPlan: initialValues.membershipPlan?._id || initialValues.membershipPlan || "",
              startDate: initialValues.startDate?.slice(0, 10) || defaultValues.startDate,
              endDate: initialValues.endDate?.slice(0, 10) || "",
              paymentStatus: initialValues.paymentStatus || "paid",
              amountPaid:
                initialValues.amountPaid !== undefined ? String(initialValues.amountPaid) : "",
              notes: initialValues.notes || ""
            }
          : defaultValues
      );
      setProfilePhoto(null);
    }
  }, [initialValues, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      profilePhoto
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValues ? "Edit member" : "Add new member"}
      description="Capture complete membership details, payment state, and profile media in one place."
    >
      <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
        <label className="field md:col-span-1">
          <span>Full Name</span>
          <input name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>
        <label className="field md:col-span-1">
          <span>Phone Number</span>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
        </label>
        <label className="field md:col-span-1">
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>
        <label className="field md:col-span-1">
          <span>Membership Plan</span>
          <select
            name="membershipPlan"
            value={form.membershipPlan}
            onChange={handleChange}
            required
          >
            <option value="">Select plan</option>
            {plans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.name} • {plan.durationDays} days
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Start Date</span>
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
        </label>
        <label className="field">
          <span>End Date</span>
          <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
        </label>
        <label className="field">
          <span>Payment Status</span>
          <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange}>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </label>
        <label className="field">
          <span>Amount Paid</span>
          <input
            name="amountPaid"
            type="number"
            min="0"
            value={form.amountPaid}
            onChange={handleChange}
          />
        </label>
        <label className="field md:col-span-2">
          <span>Profile Photo</span>
          <input type="file" accept="image/*" onChange={(event) => setProfilePhoto(event.target.files?.[0] || null)} />
        </label>
        <label className="field md:col-span-2">
          <span>Notes</span>
          <textarea name="notes" rows="4" value={form.notes} onChange={handleChange} />
        </label>
        <div className="md:col-span-2 flex flex-wrap justify-end gap-3 pt-2">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialValues ? "Save changes" : "Create member"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MemberFormModal;
