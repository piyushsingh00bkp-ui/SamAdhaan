import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastItem, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

type ToastListener = (toast: ToastItem) => void;
const listeners = new Set<ToastListener>();

export const notify = {
  show: (options: Omit<ToastItem, 'id'>) => {
    const item: ToastItem = { ...options, id: Math.random().toString(36).substring(2, 9) };
    listeners.forEach((l) => l(item));
  },
  success: (message: string, title: string = 'Success') => {
    notify.show({ type: 'success', title, message });
  },
  error: (message: string, title: string = 'Error') => {
    notify.show({ type: 'error', title, message });
  },
  warning: (message: string, title: string = 'Warning') => {
    notify.show({ type: 'warning', title, message });
  },
  info: (message: string, title: string = 'Notice') => {
    notify.show({ type: 'info', title, message });
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (options: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { ...options, id };
      setToasts((prev) => [...prev.slice(-4), newToast]);

      const duration = options.duration || 4500;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  useEffect(() => {
    const handleGlobalToast: ToastListener = (toast) => {
      setToasts((prev) => [...prev.slice(-4), toast]);
      const duration = toast.duration || 4500;
      setTimeout(() => {
        removeToast(toast.id);
      }, duration);
    };
    listeners.add(handleGlobalToast);
    return () => {
      listeners.delete(handleGlobalToast);
    };
  }, [removeToast]);

  const success = useCallback((message: string, title = 'Success') => addToast({ type: 'success', title, message }), [addToast]);
  const error = useCallback((message: string, title = 'Action Failed') => addToast({ type: 'error', title, message }), [addToast]);
  const warning = useCallback((message: string, title = 'Attention Required') => addToast({ type: 'warning', title, message }), [addToast]);
  const info = useCallback((message: string, title = 'System Update') => addToast({ type: 'info', title, message }), [addToast]);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-300 bg-white/95 text-emerald-950 shadow-emerald-900/10 shadow-lg';
      case 'error':
        return 'border-red-300 bg-white/95 text-red-950 shadow-red-900/10 shadow-lg';
      case 'warning':
        return 'border-amber-300 bg-white/95 text-amber-950 shadow-amber-900/10 shadow-lg';
      case 'info':
      default:
        return 'border-blue-300 bg-white/95 text-blue-950 shadow-blue-900/10 shadow-lg';
    }
  };

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-6 sm:bottom-6 z-[99999] flex flex-col gap-2 pointer-events-none max-w-sm sm:w-full mx-auto sm:mx-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md ${getBorderColor(
                t.type
              )}`}
            >
              <div className="mt-0.5">{getIcon(t.type)}</div>
              <div className="flex-1 min-w-0">
                {t.title && <div className="text-xs font-bold uppercase tracking-wider mb-0.5">{t.title}</div>}
                <div className="text-xs font-medium leading-relaxed break-words">{t.message}</div>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-gray-400 hover:text-gray-700 transition-colors p-0.5 rounded-md"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toast: notify.show,
      success: notify.success,
      error: notify.error,
      warning: notify.warning,
      info: notify.info,
    };
  }
  return context;
};
