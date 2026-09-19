import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div
      id="toast-container"
      className="fixed inset-x-0 bottom-3 z-50 flex w-full flex-col items-center gap-2 px-3 pointer-events-none sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-auto sm:max-w-sm sm:items-stretch sm:px-0"
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
              ? 'border-emerald-200 bg-white text-slate-900 shadow-lg shadow-emerald-950/10'
              : toast.type === 'error'
              ? 'border-rose-200 bg-white text-slate-900 shadow-lg shadow-rose-950/10'
              : toast.type === 'warning'
              ? 'border-amber-200 bg-white text-slate-900 shadow-lg shadow-amber-950/10'
              : 'border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-950/10';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className={`pointer-events-auto relative flex w-full max-w-md items-start gap-2.5 rounded-xl border px-3 py-2.5 sm:min-w-[320px] ${borderBg}`}
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
                className="ml-1 rounded p-0.5 text-slate-400 transition-colors hover:text-slate-700"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <motion.div
                aria-hidden="true"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: (toast.durationMs || 4000) / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left ${
                  toast.type === 'success'
                    ? 'bg-emerald-500'
                    : toast.type === 'error'
                    ? 'bg-rose-500'
                    : toast.type === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-slate-500'
                }`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
