import { useState } from "react";
import styles from "./CheckForm.module.css";

const TYPES = [
  { value: "", label: "Auto-detect" },
  { value: "product", label: "Product (Amazon / Flipkart)" },
  { value: "hotel", label: "Hotel" },
  { value: "flight", label: "Flight" },
];

export function CheckForm({ onSubmit, loading, error }) {
  const [url, setUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [type, setType] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ url: url.trim() || null, pastedText: pastedText.trim() || null, type: type || null });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Product / Hotel / Flight URL</label>
        <input
          type="url"
          className={styles.input}
          placeholder="https://www.amazon.in/... or https://www.flipkart.com/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className={styles.or}>— or paste details below —</div>
      <div className={styles.field}>
        <label className={styles.label}>Paste listing text (name + price)</label>
        <textarea
          className={styles.textarea}
          placeholder="Product name or hotel name&#10;₹ 2,499"
          rows={4}
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Type (optional)</label>
        <select
          className={styles.select}
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={loading}
        >
          {TYPES.map((t) => (
            <option key={t.value || "auto"} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <button type="submit" className={styles.submit} disabled={loading}>
        {loading ? "Analyzing…" : "Check price fairness"}
      </button>
    </form>
  );
}
