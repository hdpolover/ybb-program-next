import { useEffect, useRef } from "react";

/**
 * Hook buat auto-save ke localStorage dengan debounce
 * Jadi user ngetik, data kesimpen di localStorage otomatis
 * Kalau device mati, data masih ada di localStorage
 */
export function useAutoSave<T>(
  key: string,
  data: T,
  onSave?: (data: T) => void | Promise<void>,
  delay = 3000 // 3 detik delay sebelum save ke server
) {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<T>(data);

  // Save ke localStorage setiap kali data berubah
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Gagal save ke localStorage:", error);
    }
  }, [key, data]);

  // Debounce save ke server
  useEffect(() => {
    // Skip kalau data sama dengan yang terakhir disave
    if (JSON.stringify(data) === JSON.stringify(lastSavedDataRef.current)) {
      return;
    }

    // Clear timeout yang lama kalau ada
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set timeout baru buat save ke server
    saveTimeoutRef.current = setTimeout(async () => {
      if (onSave) {
        try {
          await onSave(data);
          lastSavedDataRef.current = data;
        } catch (error) {
          console.error("Gagal auto-save ke server:", error);
        }
      }
    }, delay);

    // Cleanup timeout saat unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, onSave, delay]);
}

/**
 * Load data dari localStorage
 * Dipake buat restore data yang tersimpen
 */
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.error("Gagal load dari localStorage:", error);
  }

  return defaultValue;
}

/**
 * Hapus data dari localStorage
 * Dipake setelah submit berhasil atau kalau user mau reset
 */
export function clearLocalStorage(key: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Gagal hapus localStorage:", error);
  }
}
