import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, label, value, note, accent = "from-[#FF3B3B]/30 to-[#FF7A00]/10" }) => (
  <motion.article
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="glass-panel relative overflow-hidden rounded-[24px] border border-white/10 p-5"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60`} />
    <div className="relative flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
          {label}
        </p>
        <p className="mt-3 font-display text-3xl text-[color:var(--text)]">{value}</p>
        <p className="mt-2 text-sm text-[color:var(--muted)]">{note}</p>
      </div>
      <div className="glow-ring">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.article>
);

export default StatCard;
