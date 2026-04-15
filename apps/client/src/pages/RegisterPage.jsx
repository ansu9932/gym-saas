import { ArrowLeft, Building2, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { applySession } = useAuth();
  const [form, setForm] = useState({
    gymName: "",
    ownerName: "",
    email: "",
    phoneNumber: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await api.post("/auth/register", form);
      applySession(data);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[36px] border border-white/10 bg-black/30 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex items-center justify-center border-r border-white/10 px-5 py-10 md:px-10">
          <div className="w-full max-w-lg">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[color:var(--muted)] transition hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-[#ff9b84]">
              Launch your gym workspace
            </p>
            <h2 className="mt-3 font-display text-5xl text-[color:var(--text)]">Create account</h2>
            <p className="mt-3 text-[color:var(--muted)]">
              Set up a multi-staff, analytics-ready gym SaaS dashboard in a few steps.
            </p>

            <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={submit}>
              <label className="field md:col-span-2">
                <span>Gym Name</span>
                <input
                  value={form.gymName}
                  onChange={(event) => setForm((previous) => ({ ...previous, gymName: event.target.value }))}
                  required
                />
              </label>
              <label className="field">
                <span>Owner Name</span>
                <input
                  value={form.ownerName}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, ownerName: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="field">
                <span>Phone Number</span>
                <input
                  value={form.phoneNumber}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, phoneNumber: event.target.value }))
                  }
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
                  required
                />
              </label>
              <label className="field">
                <span>Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, password: event.target.value }))
                  }
                  required
                />
              </label>
              {error ? <p className="md:col-span-2 text-sm text-rose-300">{error}</p> : null}
              <div className="md:col-span-2">
                <button type="submit" className="primary-button w-full justify-center" disabled={isSubmitting}>
                  {isSubmitting ? "Creating workspace..." : "Create premium dashboard"}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="relative hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="orb orb-red" />
          <div className="orb orb-orange" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff9b84]">What you unlock</p>
            <h1 className="mt-5 max-w-xl font-display text-6xl leading-none text-[color:var(--text)]">
              SaaS-grade member management, tuned for pro fitness centers.
            </h1>
          </div>

          <div className="grid gap-4">
            {[
              {
                icon: Building2,
                title: "Multi-gym ready",
                copy: "Every gym gets its own isolated data, staff roles, plans, reminders, and reports."
              },
              {
                icon: Zap,
                title: "Retention engine",
                copy: "Expiring alerts, branded emails, and fast renewals reduce churn before it hits revenue."
              },
              {
                icon: Shield,
                title: "Operational clarity",
                copy: "Dashboard analytics, CSV export, QR passes, and payment tracking keep teams aligned."
              }
            ].map((item) => (
              <article key={item.title} className="glass-panel rounded-[26px] border border-white/10 p-5">
                <item.icon className="h-5 w-5 text-[#ff8f55]" />
                <h3 className="mt-4 font-display text-2xl text-[color:var(--text)]">{item.title}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
