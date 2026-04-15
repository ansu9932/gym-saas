import { useEffect, useState } from "react";
import Modal from "../ui/Modal";

const blankPlan = {
  name: "",
  billingCycle: "monthly",
  durationDays: 30,
  price: "",
  description: ""
};

const PlanModal = ({ open, onClose, onSubmit, initialValues, isSubmitting }) => {
  const [form, setForm] = useState(blankPlan);

  useEffect(() => {
    setForm(
      initialValues
        ? {
            name: initialValues.name || "",
            billingCycle: initialValues.billingCycle || "monthly",
            durationDays: initialValues.durationDays || 30,
            price: initialValues.price || "",
            description: initialValues.description || ""
          }
        : blankPlan
    );
  }, [initialValues, open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValues ? "Edit plan" : "Create plan"}
      description="Offer sharp, premium packages with flexible pricing and duration."
      width="max-w-2xl"
    >
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
      >
        <label className="field">
          <span>Plan Name</span>
          <input
            value={form.name}
            onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
            required
          />
        </label>
        <label className="field">
          <span>Billing Cycle</span>
          <select
            value={form.billingCycle}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, billingCycle: event.target.value }))
            }
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        <label className="field">
          <span>Duration (days)</span>
          <input
            type="number"
            min="1"
            value={form.durationDays}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                durationDays: Number(event.target.value)
              }))
            }
            required
          />
        </label>
        <label className="field">
          <span>Price</span>
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(event) => setForm((previous) => ({ ...previous, price: event.target.value }))}
            required
          />
        </label>
        <label className="field md:col-span-2">
          <span>Description</span>
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, description: event.target.value }))
            }
          />
        </label>
        <div className="md:col-span-2 flex justify-end gap-3">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialValues ? "Save plan" : "Create plan"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PlanModal;
