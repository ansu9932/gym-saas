import { AnimatePresence, motion } from "framer-motion";

const Modal = ({ open, title, description, children, onClose, width = "max-w-3xl" }) => (
  <AnimatePresence>
    {open ? (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`glass-panel relative w-full ${width} overflow-hidden rounded-[28px] border border-white/10 p-6`}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl text-[color:var(--text)]">{title}</h3>
              {description ? (
                <p className="mt-1 text-sm text-[color:var(--muted)]">{description}</p>
              ) : null}
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-[color:var(--text)] transition hover:border-white/20 hover:bg-white/10"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

export default Modal;
