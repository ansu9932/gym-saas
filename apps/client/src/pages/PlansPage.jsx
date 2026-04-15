import { PencilLine, Plus, ShieldCheck, Trash2, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client";
import PlanModal from "../components/plans/PlanModal";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatters";

const PlansPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [plans, setPlans] = useState([]);
  const [staff, setStaff] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [staffForm, setStaffForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "staff"
  });

  // LOAD DATA
  const load = async () => {
    const { data } = await api.get("/plans");
    setPlans(data);

    if (isAdmin) {
      const staffResponse = await api.get("/auth/staff");
      setStaff(staffResponse.data);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 💳 PAYMENT FUNCTION
  const handlePayment = async (amount) => {
    try {
      const { data } = await api.post("/payment/create-order", {
        amount,
      });

      const options = {
        key: "rzp_live_Sdf6GT7s0qHb6p", // your key
        amount: data.amount,
        currency: "INR",
        name: "Gym Membership",
        order_id: data.id,

        handler: async function (response) {
          await api.post("/payment/verify", response);
          alert("Payment Successful 🎉");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    }
  };

  // PLAN CRUD
  const submitPlan = async (payload) => {
    setIsSubmitting(true);
    try {
      if (selectedPlan) {
        await api.put(`/plans/${selectedPlan._id}`, payload);
      } else {
        await api.post("/plans", payload);
      }
      setModalOpen(false);
      setSelectedPlan(null);
      load();
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePlan = async (plan) => {
    if (!window.confirm(`Delete plan "${plan.name}"?`)) return;
    await api.delete(`/plans/${plan._id}`);
    load();
  };

  const createStaff = async (event) => {
    event.preventDefault();
    await api.post("/auth/staff", staffForm);
    setStaffForm({ fullName: "", email: "", password: "", role: "staff" });
    load();
  };

  return (
    <div className="space-y-4">

      {/* PLANS */}
      <section className="glass-panel rounded-[32px] border border-white/10 p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Membership Plans</h3>

          {isAdmin && (
            <button
              className="primary-button"
              onClick={() => {
                setSelectedPlan(null);
                setModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Create Plan
            </button>
          )}
        </div>

        <div className="grid gap-4 mt-5 xl:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan._id} className="p-5 border rounded-xl bg-black/20">

              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-2xl">{formatCurrency(plan.price)}</p>
              <p>{plan.durationDays} days</p>

              {/* 🔥 BUTTON SECTION */}
              <div className="mt-4 flex gap-2 flex-wrap">

                {/* ADMIN CONTROLS */}
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedPlan(plan);
                        setModalOpen(true);
                      }}
                      className="secondary-button"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deletePlan(plan)}
                      className="secondary-button"
                    >
                      Delete
                    </button>
                  </>
                )}

                {/* 🔥 ALWAYS SHOW PAYMENT */}
                <button
                  onClick={() => handlePayment(plan.price)}
                  className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-lg text-white font-semibold hover:scale-105 transition"
                >
                  Upgrade Plan
                </button>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STAFF */}
      {isAdmin && (
        <section className="grid gap-4 xl:grid-cols-2">

          <div className="p-5 border rounded-xl">
            <h3 className="text-xl font-bold">Staff</h3>
            {staff.map((s) => (
              <div key={s._id}>{s.fullName} ({s.role})</div>
            ))}
          </div>

          <form onSubmit={createStaff} className="p-5 border rounded-xl">
            <h3 className="text-xl font-bold">Add Staff</h3>

            <input
              placeholder="Name"
              value={staffForm.fullName}
              onChange={(e) =>
                setStaffForm({ ...staffForm, fullName: e.target.value })
              }
            />

            <input
              placeholder="Email"
              value={staffForm.email}
              onChange={(e) =>
                setStaffForm({ ...staffForm, email: e.target.value })
              }
            />

            <input
              placeholder="Password"
              value={staffForm.password}
              onChange={(e) =>
                setStaffForm({ ...staffForm, password: e.target.value })
              }
            />

            <button type="submit">Add Staff</button>
          </form>

        </section>
      )}

      <PlanModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPlan(null);
        }}
        onSubmit={submitPlan}
        initialValues={selectedPlan}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default PlansPage;