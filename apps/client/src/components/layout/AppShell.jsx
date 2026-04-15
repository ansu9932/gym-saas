import { motion } from "framer-motion";
import {
  BellRing,
  CalendarCheck2,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  MoonStar,
  SunMedium,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    to: "/members",
    label: "Members",
    icon: Users
  },
  {
    to: "/plans",
    label: "Plans",
    icon: Layers3
  },
  {
    to: "/attendance",
    label: "Attendance",
    icon: CalendarCheck2
  },
  {
    to: "/notifications",
    label: "Notifications",
    icon: BellRing
  }
];

const pageCopy = {
  "/dashboard": {
    title: "Performance Command",
    description: "Track revenue, member momentum, churn risk, and activity from a single premium view."
  },
  "/members": {
    title: "Member Control",
    description: "Search, renew, export, and manage every active or expiring membership without friction."
  },
  "/plans": {
    title: "Plan Studio",
    description: "Build pricing tiers and staff permissions that match your gym's premium operating model."
  },
  "/attendance": {
    title: "Check-In Flow",
    description: "Use QR-driven access and fast manual entry to keep attendance records accurate."
  },
  "/notifications": {
    title: "Signal Center",
    description: "Stay ahead of expiring memberships, reminders, and operational alerts in real time."
  }
};

const AppShell = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const headerCopy = useMemo(
    () => pageCopy[location.pathname] || pageCopy["/dashboard"],
    [location.pathname]
  );

  return (
    <div className="min-h-screen px-4 py-4 md:px-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="orb orb-red" />
        <div className="orb orb-orange" />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className={`glass-panel fixed inset-y-4 left-4 z-40 w-[290px] rounded-[32px] border border-white/10 p-5 transition lg:static lg:block ${
            sidebarOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff9b84]">
                FlexBoard
              </p>
              <h1 className="font-display text-3xl text-[color:var(--text)]">Gym OS</h1>
            </Link>
            <button className="icon-button lg:hidden" type="button" onClick={() => setSidebarOpen(false)}>
              ×
            </button>
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Active Gym
            </p>
            <p className="mt-2 font-display text-2xl text-[color:var(--text)]">{user?.gym?.name}</p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {user?.role === "admin" ? "Admin access" : "Staff access"}
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF3B3B]/20 to-[#FF7A00]/15 text-white shadow-[0_0_30px_rgba(255,59,59,0.15)]"
                      : "text-[color:var(--muted)] hover:bg-white/[0.04] hover:text-[color:var(--text)]"
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="soft-divider mt-8" />

          <button className="secondary-button mt-6 w-full justify-center" type="button" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </motion.aside>

        <div className="space-y-4">
          <header className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-white/10 px-5 py-5">
            <div className="flex items-start gap-3">
              <button className="icon-button lg:hidden" type="button" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#ff9b84]">{user?.gym?.slug}</p>
                <h2 className="font-display text-3xl text-[color:var(--text)]">{headerCopy.title}</h2>
                <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">{headerCopy.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/notifications" className="icon-button relative">
                <BellRing className="h-4 w-4" />
                {user?.unreadNotifications ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#FF3B3B] px-1.5 text-[10px] font-bold text-white">
                    {user.unreadNotifications}
                  </span>
                ) : null}
              </Link>
              <button className="icon-button" type="button" onClick={toggleTheme}>
                {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </button>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <p className="text-sm font-semibold text-[color:var(--text)]">{user?.fullName}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{user?.role}</p>
              </div>
            </div>
          </header>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
