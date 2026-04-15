import { Download, Plus, Search } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import api from "../api/client";
import QrModal from "../components/attendance/QrModal";
import MemberFormModal from "../components/members/MemberFormModal";
import MembersTable from "../components/members/MembersTable";
import { useAuth } from "../context/AuthContext";

const MembersPage = () => {
  const { user } = useAuth();

  const [membersResponse, setMembersResponse] = useState({
    items: [],
    pagination: { page: 1, totalPages: 1, total: 0 }
  });

  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [page, setPage] = useState(1);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [qrState, setQrState] = useState({
    open: false,
    memberName: "",
    qrDataUrl: "",
    qrValue: ""
  });

  const isAdmin = user?.role === "admin";

  // LOAD DATA
  const loadPlans = async () => {
    const { data } = await api.get("/plans");
    setPlans(data);
  };

  const loadMembers = async () => {
    const { data } = await api.get("/members", {
      params: {
        page,
        search: deferredSearch || undefined,
        status: status !== "all" ? status : undefined,
        paymentStatus: paymentStatus !== "all" ? paymentStatus : undefined,
        plan: plan !== "all" ? plan : undefined
      }
    });
    setMembersResponse(data);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    loadMembers();
  }, [page, deferredSearch, status, paymentStatus, plan]);

  // ADD / EDIT MEMBER
  const submitMember = async (payload) => {
    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    try {
      if (editingMember) {
        await api.put(`/members/${editingMember._id}`, formData);
      } else {
        await api.post("/members", formData);
      }

      setMemberModalOpen(false);
      setEditingMember(null);
      loadMembers();
    } finally {
      setIsSubmitting(false);
    }
  };

  // 💳 RAZORPAY RENEWAL
  const handleRenew = async (member) => {
    try {
      const amount =
        member.membershipPlan?.price ||
        member.membershipPlan?.amount ||
        999;

      const { data } = await api.post("/payment/create-order", {
        amount,
      });

      const options = {
        key: "rzp_live_Sdf6GT7s0qHb6p",
        amount: data.amount,
        currency: "INR",
        name: "Membership Renewal",
        description: member.fullName,
        order_id: data.id,

        handler: async function (response) {
          try {
            // VERIFY PAYMENT
            await api.post("/payment/verify", {
              ...response,
              memberId: member._id,
            });

            // RENEW MEMBERSHIP
            await api.post(`/members/${member._id}/renew`, {
              membershipPlan:
                member.membershipPlan?._id || member.membershipPlan,
            });

            alert("Membership Renewed ✅");
            loadMembers();
          } catch (err) {
            console.log(err);
            alert("Renew failed after payment");
          }
        },

        theme: {
          color: "#ff3b3b",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    }
  };

  // DELETE MEMBER
  const handleDelete = async (member) => {
    if (!window.confirm(`Delete ${member.fullName}?`)) return;

    await api.delete(`/members/${member._id}`);
    loadMembers();
  };

  // EXPORT CSV
  const handleExport = async () => {
    const response = await api.get("/members/export/csv", {
      responseType: "blob"
    });

    const blobUrl = URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${user.gym.slug}-members.csv`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  // QR CODE
  const openQr = async (member) => {
    setQrState({
      open: true,
      memberName: member.fullName,
      qrDataUrl: "",
      qrValue: member.qrCodeValue || ""
    });

    const { data } = await api.get(`/attendance/${member._id}/qrcode`);

    setQrState({
      open: true,
      memberName: member.fullName,
      qrDataUrl: data.qrDataUrl,
      qrValue: data.qrCodeValue
    });
  };

  return (
    <div className="space-y-4">
      <section className="glass-panel rounded-[32px] border border-white/10 p-5">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#ff9b84]">
              Member operations
            </p>
            <h3 className="mt-2 font-display text-3xl text-[color:var(--text)]">
              Roster control
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {isAdmin && (
              <button className="secondary-button" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            )}

            <button
              className="primary-button"
              onClick={() => {
                setEditingMember(null);
                setMemberModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Member
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mt-5 grid gap-3 xl:grid-cols-[1.4fr_repeat(3,minmax(0,0.7fr))]">

          <label className="field">
            <span>Search</span>
            <div className="flex items-center gap-3">
              <Search className="h-4 w-4 text-[color:var(--muted)]" />
              <input
                placeholder="Name, phone, email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </label>

          <label className="field">
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring</option>
              <option value="expired">Expired</option>
            </select>
          </label>

          <label className="field">
            <span>Payment</span>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </label>

          <label className="field">
            <span>Plan</span>
            <select value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="all">All</option>
              {plans.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </label>

        </div>

        {/* TABLE */}
        <div className="mt-5">
          <MembersTable
            members={membersResponse.items}
            canDelete={isAdmin}
            onEdit={(m) => {
              setEditingMember(m);
              setMemberModalOpen(true);
            }}
            onRenew={handleRenew} // 🔥 payment here
            onDelete={handleDelete}
            onViewQr={openQr}
          />
        </div>

      </section>

      <MemberFormModal
        open={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        onSubmit={submitMember}
        plans={plans}
        initialValues={editingMember}
        isSubmitting={isSubmitting}
      />

      <QrModal
        open={qrState.open}
        onClose={() => setQrState({ ...qrState, open: false })}
        memberName={qrState.memberName}
        qrDataUrl={qrState.qrDataUrl}
        qrValue={qrState.qrValue}
      />
    </div>
  );
};

export default MembersPage;