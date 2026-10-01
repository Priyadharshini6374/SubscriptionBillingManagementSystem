import React from 'react';
import { useBilling } from '../../context/BillingContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBilling();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900',
          error: 'border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900',
          warning: 'border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900',
          info: 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all transform translate-y-0 duration-200 ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-sm text-slate-800 dark:text-slate-200 flex-1 leading-snug font-medium">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 p-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
