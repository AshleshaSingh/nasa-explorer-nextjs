"use client";

import { useToast } from "@/components/Toast";

export function useCustomToast() {
  const { addToast } = useToast();

  const showSuccess = (message: string) => {
    addToast(message, "success", 3000);
  };

  const showError = (message: string) => {
    addToast(message, "error", 4000);
  };

  const showInfo = (message: string) => {
    addToast(message, "info", 3000);
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
}
