import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckForm } from "../components/CheckForm";
import { HistoryList } from "../components/HistoryList";
import { Layout } from "../components/Layout";
import { useNotification } from "../context/NotificationContext";
import { API } from "../config";
import styles from "./Dashboard.module.css";

const PAGE_SIZE = 8;

export function Dashboard() {
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useNotification();
  const [historyData, setHistoryData] = useState({ items: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [filterRec, setFilterRec] = useState("");

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(PAGE_SIZE));
      if (filterType) params.set("type", filterType);
      if (filterRec) params.set("recommendation", filterRec);
      const res = await fetch(`${API}/history?${params}`);
      if (res.ok) {
        const data = await res.json();
        setHistoryData({
          items: data.items || [],
          total: data.total ?? 0,
          page: data.page ?? 1,
          totalPages: data.totalPages ?? 1,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  }, [page, filterType, filterRec]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  async function handleSubmit({ url, pastedText, type }) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url || null, pastedText: pastedText || null, type: type || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data.error || "Analysis failed";
        setError(message);
        toastError(message);
        return;
      }
      if (data.id) {
        toastSuccess("Price check saved. Viewing result.");
        navigate(`/result/${data.id}`);
        setPage(1);
        loadHistory();
        return;
      }
      const fallback = "No result ID returned";
      setError(fallback);
      toastError(fallback);
    } catch (e) {
      const message = e.message || "Request failed";
      setError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(type, recommendation) {
    setFilterType(type);
    setFilterRec(recommendation);
    setPage(1);
  }

  return (
    <Layout>
      <div className={styles.dashboard}>
        <header className={styles.hero}>
          <h1 className={styles.title}>
            <span className={styles.brand}>Dashboard</span>
            <span className={styles.subtitle}>Check price fairness & view history</span>
          </h1>
          <p className={styles.tagline}>
            Paste a product link or details — we analyze fair price, surge patterns, and recommend buy now or wait.
          </p>
        </header>

        <section className={styles.formSection}>
          <CheckForm onSubmit={handleSubmit} loading={loading} error={error} />
        </section>

        <section className={styles.historySection}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Recent checks</h2>
            <HistoryList
              items={historyData.items}
              total={historyData.total}
              page={historyData.page}
              totalPages={historyData.totalPages}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              onRefresh={loadHistory}
              onFilterChange={handleFilterChange}
              filterType={filterType}
              filterRec={filterRec}
              loading={historyLoading}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
