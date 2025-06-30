import { useState } from "react";

interface ToastProps {
  title: string;
  description?: string;
  duration?: number;
  variant?: "default" | "destructive";
  className?: string;
}

interface ToastWithId extends ToastProps {
  id: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastWithId[]>([]);

  const toast = (props: ToastProps) => {
    const id = Date.now();
    const newToast: ToastWithId = { ...props, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, props.duration || 3000);
  };

  return { toast, toasts };
};

// Simple toast function for direct use
export const toast = (props: ToastProps) => {
  console.log("Toast:", props.title, props.description);
  // In a real implementation, this would dispatch to a toast context
};
