import { createContext, useContext, useState, useCallback, useEffect } from "react";
import styles from "../components/Toast.module.css";

const NotificationContext = createContext(null);
const TOAST_DURATION_MS = 5000;

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = "default") => {
    const id = Math.random().toString(36).slice(2);
    const expiresAt = Date.now() + TOAST_DURATION_MS;
    setToasts((prev) => [...prev, { id, message, type, expiresAt }]);
    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setToasts((prev) => prev.filter((t) => t.expiresAt > now));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const success = useCallback((message) => add(message, "success"), [add]);
  const error = useCallback((message) => add(message, "error"), [add]);
  const info = useCallback((message) => add(message, "info"), [add]);

  return (
    <NotificationContext.Provider value={{ show: add, success, error, info, remove }}>
      {children}
      <div className={styles.container} aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${styles[t.type]}`}
            role="alert"
          >
            <span className={styles.icon}>
              {t.type === "success" && "✓"}
              {t.type === "error" && "!"}
              {t.type === "info" && "i"}
            </span>
            <span className={styles.message}>{t.message}</span>
            <button
              type="button"
              className={styles.close}
              onClick={() => remove(t.id)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    return {
      show: (msg) => console.warn("NotificationProvider missing", msg),
      success: (msg) => console.warn("NotificationProvider missing", msg),
      error: (msg) => console.warn("NotificationProvider missing", msg),
      info: (msg) => console.warn("NotificationProvider missing", msg),
    };
  }
  return ctx;
}
