import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import styles from "./Result.module.css";

const API = "/api";

export function Result() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/check/${id}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className={styles.wrap}>
          <div className={styles.loading}>Loading analysis…</div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className={styles.wrap}>
          <div className={styles.error}>{error || "Result not found"}</div>
          <Link to="/dashboard" className={styles.back}>← Back to Dashboard</Link>
        </div>
      </Layout>
    );
  }

  let analysis = {};
  try {
    if (data.fullAnalysis) analysis = typeof data.fullAnalysis === "string" ? JSON.parse(data.fullAnalysis) : data.fullAnalysis;
  } catch (_) {}

  const recommendation = (data.recommendation || analysis.recommendation || "").toLowerCase();
  const confidence = data.confidenceScore ?? analysis.confidenceScore ?? 0;
  const surgeScore = data.surgeScore ?? analysis.surgeScore ?? 0;
  const fairLow = data.fairPriceLow ?? analysis.fairPriceLow;
  const fairHigh = data.fairPriceHigh ?? analysis.fairPriceHigh;
  const reasons = analysis.reasons || [];
  const bestTimeToBuy = analysis.bestTimeToBuy;

  return (
    <Layout>
      <div className={styles.wrap}>
        <Link to="/dashboard" className={styles.back}>← Back to Dashboard</Link>

        <header className={styles.header}>
          <span className={styles.type}>{data.type || "product"}</span>
          {data.sourceName && <span className={styles.source}>{data.sourceName}</span>}
          <h1 className={styles.title}>{data.title || "Price check"}</h1>
          <p className={styles.currentPrice}>
            Current price <strong>₹{Number(data.currentPrice).toLocaleString("en-IN")}</strong> {data.currency}
          </p>
        </header>

        <div className={styles.cards}>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Fair price range</h3>
            <div className={styles.range}>
              {fairLow != null && fairHigh != null ? (
                <>
                  <span className={styles.rangeVal}>₹{Number(fairLow).toLocaleString("en-IN")}</span>
                  <span className={styles.rangeSep}>–</span>
                  <span className={styles.rangeVal}>₹{Number(fairHigh).toLocaleString("en-IN")}</span>
                </>
              ) : (
                <span className={styles.rangeUnknown}>Not estimated</span>
              )}
            </div>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Surge / dynamic pricing</h3>
            <div className={styles.surgeWrap}>
              <div className={styles.surgeBar}>
                <div
                  className={styles.surgeFill}
                  style={{ width: `${Math.min(100, Math.max(0, surgeScore))}%` }}
                />
              </div>
              <span className={styles.surgeLabel}>{Math.round(surgeScore)}% surge score</span>
            </div>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Recommendation</h3>
            <div className={styles.recWrap}>
              <span
                className={
                  recommendation === "buy_now" ? styles.recBuy :
                  recommendation === "wait" ? styles.recWait :
                  styles.recNeutral
                }
              >
                {recommendation === "buy_now" ? "Buy now" : recommendation === "wait" ? "Wait" : "Neutral"}
              </span>
              {bestTimeToBuy && (
                <p className={styles.bestTime}>Best time to buy: {bestTimeToBuy}</p>
              )}
            </div>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Confidence</h3>
            <div className={styles.confWrap}>
              <div className={styles.confBar}>
                <div
                  className={styles.confFill}
                  style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
                />
              </div>
              <span className={styles.confLabel}>{Math.round(confidence)}% confidence in analysis</span>
            </div>
          </section>
        </div>

        {(data.insightSummary || analysis.insightSummary) && (
          <section className={styles.insight}>
            <h3 className={styles.insightTitle}>Summary</h3>
            <p className={styles.insightText}>{data.insightSummary || analysis.insightSummary}</p>
          </section>
        )}

        {reasons.length > 0 && (
          <section className={styles.reasons}>
            <h3 className={styles.reasonsTitle}>Reasons</h3>
            <ul className={styles.reasonsList}>
              {reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Layout>
  );
}
