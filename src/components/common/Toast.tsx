import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const icon =
            toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-[#561269] shrink-0" />
            );

          const borderBg =
            toast.type === 'success'
              ? 'border-emerald-200 bg-white text-slate-900 shadow-lg shadow-emerald-950/5'
              : toast.type === 'error'
              ? 'border-rose-200 bg-white text-slate-900 shadow-lg shadow-rose-950/5'
              : toast.type === 'warning'
              ? 'border-amber-200 bg-white text-slate-900 shadow-lg shadow-amber-950/5'
              : 'border-[#561269]/20 bg-white text-slate-900 shadow-lg shadow-indigo-950/5';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className={`pointer-events-auto relative flex items-start gap-3 p-3.5 rounded-xl border overflow-hidden ${borderBg}`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                id={`toast-close-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <motion.div
                aria-hidden="true"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: (toast.durationMs || 4000) / 1000, ease: 'linear' }}
                className="absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-[#561269] via-violet-500 to-[#FF6B00]"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
