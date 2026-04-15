import { BellRing, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { formatDateTime } from "../utils/formatters";

const NotificationsPage = () => {
  const { setUnreadNotifications } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const load = async () => {
    const { data } = await api.get("/notifications");
    setNotifications(data.items);
    setUnreadNotifications(data.unreadCount);
  };

  useEffect(() => {
    load();
  }, []);

  const markAsRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    load();
  };

  const markAll = async () => {
    await api.patch("/notifications/mark-all-read");
    load();
  };

  return (
    <div className="space-y-4">
      <section className="glass-panel rounded-[32px] border border-white/10 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#ff9b84]">Live alerting</p>
            <h3 className="mt-2 font-display text-3xl text-[color:var(--text)]">Notifications</h3>
          </div>
          <button type="button" className="secondary-button" onClick={markAll}>
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification._id}
              className={`rounded-[24px] border p-5 ${
                notification.readAt
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-[#ff6f4c]/30 bg-[#ff6f4c]/[0.08]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="glow-ring">
                    <BellRing className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[color:var(--text)]">{notification.title}</h4>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">{notification.message}</p>
                  </div>
                </div>
                {!notification.readAt ? (
                  <button type="button" className="secondary-button" onClick={() => markAsRead(notification._id)}>
                    Mark read
                  </button>
                ) : null}
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                {formatDateTime(notification.createdAt)}
              </p>
            </article>
          ))}

          {!notifications.length ? (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-[color:var(--muted)]">
              Your dashboard is quiet. New reminder and operational alerts will appear here.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default NotificationsPage;
