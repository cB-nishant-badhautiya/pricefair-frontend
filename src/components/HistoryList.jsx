import { Link } from "react-router-dom";
import styles from "./HistoryList.module.css";

function formatDate(d) {
  try {
    const date = new Date(d);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  } catch {
    return "";
  }
}

function RecBadge({ recommendation }) {
  const r = (recommendation || "").toLowerCase();
  const cls =
    r === "buy_now" ? styles.buy :
    r === "wait" ? styles.wait :
    styles.neutral;
  const label = r === "buy_now" ? "Buy now" : r === "wait" ? "Wait" : "Neutral";
  return <span className={cls}>{label}</span>;
}

export function HistoryList({
  items,
  total,
  page,
  totalPages,
  pageSize,
  onPageChange,
  onRefresh,
  onFilterChange,
  filterType,
  filterRec,
  loading,
}) {
  const hasFilters = typeof onFilterChange === "function";
  const hasPagination = totalPages > 1 && typeof onPageChange === "function";

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Loading history…</p>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className={styles.empty}>
        <p>No checks yet. Run your first analysis above.</p>
        {onRefresh && (
          <button type="button" className={styles.refresh} onClick={onRefresh}>
            Refresh
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        {hasFilters && (
          <div className={styles.filters}>
            <select
              className={styles.filterSelect}
              value={filterType || ""}
              onChange={(e) => onFilterChange(e.target.value, filterRec)}
              aria-label="Filter by type"
            >
              <option value="">All types</option>
              <option value="product">Product</option>
              <option value="hotel">Hotel</option>
              <option value="flight">Flight</option>
            </select>
            <select
              className={styles.filterSelect}
              value={filterRec || ""}
              onChange={(e) => onFilterChange(filterType, e.target.value)}
              aria-label="Filter by recommendation"
            >
              <option value="">All recommendations</option>
              <option value="buy_now">Buy now</option>
              <option value="wait">Wait</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        )}
        {onRefresh && (
          <button type="button" className={styles.refresh} onClick={onRefresh}>
            Refresh
          </button>
        )}
      </div>

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <Link to={`/result/${item.id}`} className={styles.link}>
              <div className={styles.row}>
                <span className={styles.title} title={item.title}>
                  {item.title ? (item.title.length > 50 ? item.title.slice(0, 50) + "…" : item.title) : "Untitled"}
                </span>
                <span className={styles.meta}>
                  ₹{Number(item.currentPrice).toLocaleString("en-IN")}
                  {item.sourceName && ` · ${item.sourceName}`}
                </span>
              </div>
              <div className={styles.row2}>
                <RecBadge recommendation={item.recommendation} />
                {item.surgeScore != null && (
                  <span className={styles.surge}>
                    Surge {Math.round(item.surgeScore)}%
                  </span>
                )}
                <span className={styles.time}>{formatDate(item.createdAt)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {hasPagination && (
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            {total > 0
              ? `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total}`
              : "0 results"}
          </span>
          <div className={styles.paginationButtons}>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label="Previous page"
            >
              ← Prev
            </button>
            <span className={styles.pageNum}>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
