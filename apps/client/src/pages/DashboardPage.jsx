import { motion } from "framer-motion";
import {
  AlertTriangle,
  CircleDollarSign,
  TrendingUp,
  UserRoundPlus,
  UsersRound
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import api from "../api/client";
import StatCard from "../components/dashboard/StatCard";
import { formatCurrency, formatDate, formatDaysLeft } from "../utils/formatters";
import { statusMeta } from "../utils/status";
import StatusBadge from "../components/ui/StatusBadge";

const DashboardPage = () => {
  const pieColors = ["#FF4D3D", "#FF7A00", "#FF9B3D", "#F6B73C", "#FDBA74"];
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: response } = await api.get("/dashboard/overview");
        setData(response);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="glass-panel rounded-[32px] border border-white/10 p-8 text-[color:var(--muted)]">Loading dashboard...</div>;
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        <StatCard icon={UsersRound} label="Total Members" value={stats.totalMembers || 0} note="Complete member base across this gym workspace." />
        <StatCard
          icon={TrendingUp}
          label="Active Memberships"
          value={stats.activeMemberships || 0}
          note="Members with 5 or more days remaining."
          accent="from-emerald-500/20 to-emerald-300/5"
        />
        <StatCard
          icon={AlertTriangle}
          label="Expiring Soon"
          value={stats.expiringSoon || 0}
          note="Members needing a renewal push within the next 5 days."
          accent="from-amber-500/20 to-amber-300/5"
        />
        <StatCard
          icon={CircleDollarSign}
          label="Collected Revenue"
          value={formatCurrency(stats.monthlyRevenue || 0)}
          note="Current membership value captured from paid and partial records."
          accent="from-cyan-500/20 to-cyan-300/5"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[32px] border border-white/10 p-5"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#ff9b84]">Revenue velocity</p>
              <h3 className="mt-2 font-display text-3xl text-[color:var(--text)]">Monthly revenue</h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[color:var(--muted)]">
              Last 6 months
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts?.revenue || []}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF3B3B" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#FF7A00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9d9da7" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9d9da7" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,10,10,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "18px"
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#FF6A3C" fill="url(#revenueFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[32px] border border-white/10 p-5"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[#ff9b84]">Plan mix</p>
          <h3 className="mt-2 font-display text-3xl text-[color:var(--text)]">Active plan share</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.charts?.planMix || []}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {(data?.charts?.planMix || []).map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,10,10,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "18px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {(data?.charts?.planMix || []).map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="text-sm text-[color:var(--text)]">{item.name}</span>
                <span className="text-sm text-[color:var(--muted)]">{item.value} members</span>
              </div>
            ))}
          </div>
        </motion.article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[32px] border border-white/10 p-5"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#ff9b84]">Growth curve</p>
              <h3 className="mt-2 font-display text-3xl text-[color:var(--text)]">New members</h3>
            </div>
            <UserRoundPlus className="h-5 w-5 text-[#ff8f55]" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.charts?.newMembers || []}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#9d9da7" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9d9da7" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,10,10,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "18px"
                  }}
                />
                <Bar dataKey="value" fill="#FF7A00" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[32px] border border-white/10 p-5"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[#ff9b84]">Action required</p>
          <h3 className="mt-2 font-display text-3xl text-[color:var(--text)]">Expiring members</h3>
          <div className="mt-5 space-y-3">
            {(data?.expiringMembers || []).length ? (
              data.expiringMembers.map((member) => (
                <div key={member._id} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[color:var(--text)]">{member.fullName}</p>
                      <p className="text-sm text-[color:var(--muted)]">
                        {member.planName} • {formatDate(member.endDate)}
                      </p>
                    </div>
                    <StatusBadge
                      label={statusMeta[member.status]?.label || member.status}
                      tone={statusMeta[member.status]?.className || statusMeta.expiring.className}
                    />
                  </div>
                  <p className="mt-3 text-sm text-[#ffb07a]">{formatDaysLeft(member.daysLeft)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-[color:var(--muted)]">
                No memberships are approaching expiry right now.
              </div>
            )}
          </div>
        </motion.article>
      </section>

      <section className="glass-panel rounded-[32px] border border-white/10 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-[#ff9b84]">Latest additions</p>
        <h3 className="mt-2 font-display text-3xl text-[color:var(--text)]">Recent members</h3>
        <div className="mt-5 grid gap-4 lg:grid-cols-5">
          {(data?.recentMembers || []).map((member) => (
            <article key={member._id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <p className="font-semibold text-[color:var(--text)]">{member.fullName}</p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">{member.planName}</p>
              <p className="mt-4 text-sm text-[color:var(--muted)]">{formatDate(member.startDate)}</p>
              <p className="mt-2 text-sm text-[#ffb07a]">{formatDaysLeft(member.daysLeft)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
