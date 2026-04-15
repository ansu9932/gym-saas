import { Dumbbell, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { applySession } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await api.post("/auth/login", form);
      applySession(data);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[36px] border border-white/10 bg-black/30 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="orb orb-red" />
          <div className="orb orb-orange" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff9b84]">FlexBoard</p>
            <h1 className="mt-5 max-w-xl font-display text-6xl leading-none text-[color:var(--text)]">
              Premium membership intelligence for modern fitness brands.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[color:var(--muted)]">
              Manage members, renewals, reminders, revenue, QR check-ins, and multi-staff operations from one refined control room.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                icon: Sparkles,
                title: "Luxury SaaS feel",
                copy: "Dark glassmorphism surfaces, fast actions, and focused analytics built for high-end gyms."
              },
              {
                icon: ShieldCheck,
                title: "Secure access",
                copy: "JWT-backed sessions and tenant-isolated dashboards keep every gym account separated."
              },
              {
                icon: Dumbbell,
                title: "Retention first",
                copy: "Monitor expiring members early, launch reminders, and renew in one click."
              }
            ].map((item) => (
              <article key={item.title} className="glass-panel rounded-[26px] border border-white/10 p-5">
                <item.icon className="h-5 w-5 text-[#ff8f55]" />
                <h2 className="mt-4 font-display text-2xl text-[color:var(--text)]">{item.title}</h2>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 md:px-10">
          <div className="w-full max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff9b84]">Welcome back</p>
            <h2 className="mt-3 font-display text-5xl text-[color:var(--text)]">Sign in</h2>
            <p className="mt-3 text-[color:var(--muted)]">
              Step into your gym command center and manage memberships without friction.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
                  onChange={(event) => setForm((previous) => ({ ...previous, password: event.target.value }))}
                  required
                />
              </label>
              {error ? <p className="text-sm text-rose-300">{error}</p> : null}
              <button type="submit" className="primary-button w-full justify-center" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Access dashboard"}
              </button>
            </form>

            <p className="mt-6 text-sm text-[color:var(--muted)]">
              Need a new gym workspace?{" "}
              <Link to="/register" className="font-semibold text-[#ff9b84] transition hover:text-white">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
