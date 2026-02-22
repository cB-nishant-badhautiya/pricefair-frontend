import { Link } from "react-router-dom";
import { useInView } from "../hooks/useInView";
import styles from "./Landing.module.css";

export function Landing() {
  const [featuresRef, featuresInView] = useInView();
  const [howRef, howInView] = useInView();
  const [sourcesRef, sourcesInView] = useInView();

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>PriceFair</Link>
        <div className={styles.navLinks}>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <Link to="/dashboard" className={styles.ctaNav}>Dashboard</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>AI-Powered Price Intelligence</span>
          <h1 className={styles.heroTitle}>
            Know if you&apos;re paying
            <span className={styles.heroGradient}> fair price</span>
          </h1>
          <p className={styles.heroSub}>
            Paste any product, hotel, or flight link. We analyze fair value, detect surge pricing, and tell you whether to buy now or wait — in seconds.
          </p>
          <Link to="/dashboard" className={styles.heroCta}>
            Check a price →
          </Link>
        </div>
        <div className={styles.heroOrb} aria-hidden />
      </section>

      <section id="features" ref={featuresRef} className={`${styles.section} ${featuresInView ? styles.sectionInView : ""}`}>
        <h2 className={styles.sectionTitle}>What you get</h2>
        <div className={styles.featureGrid}>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>₹</div>
            <h3>Fair price range</h3>
            <p>AI estimates a fair low–high range so you know if the listing is overpriced.</p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>📈</div>
            <h3>Surge detection</h3>
            <p>See a surge score and dynamic-pricing signals so you can wait for a better time.</p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>✓</div>
            <h3>Buy or wait</h3>
            <p>Clear recommendation: buy now, wait, or neutral — plus suggested best time to buy.</p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>%</div>
            <h3>Confidence score</h3>
            <p>Every result comes with a confidence rating so you know how reliable the analysis is.</p>
          </article>
        </div>
      </section>

      <section id="how" ref={howRef} className={`${styles.section} ${howInView ? styles.sectionInView : ""}`}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNum}>1</span>
            <h3>Paste link or details</h3>
            <p>Product URL (Amazon, Flipkart) or paste name + price for hotels and flights.</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>2</span>
            <h3>We analyze</h3>
            <p>Our system scrapes when possible and uses AI to estimate fair value and surge patterns.</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>3</span>
            <h3>Get your insight</h3>
            <p>See fair range, surge score, recommendation, and confidence — then decide.</p>
          </div>
        </div>
      </section>

      <section ref={sourcesRef} className={`${styles.section} ${sourcesInView ? styles.sectionInView : ""}`}>
        <h2 className={styles.sectionTitle}>Supported sources</h2>
        <div className={styles.sources}>
          <span className={styles.sourceTag}>Amazon</span>
          <span className={styles.sourceTag}>Flipkart</span>
          <span className={styles.sourceTag}>Hotels</span>
          <span className={styles.sourceTag}>Flights</span>
          <span className={styles.sourceTag}>Pasted text</span>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} aria-hidden />
        <h2 className={styles.ctaTitle}>Ready to check a price?</h2>
        <p className={styles.ctaSub}>Open the dashboard and run your first analysis.</p>
        <Link to="/dashboard" className={styles.ctaButton}>Go to Dashboard</Link>
      </section>

      <footer className={styles.footer}>
        <span>PriceFair — AI Dynamic Price Fairness Checker · Hackathon</span>
      </footer>
    </div>
  );
}
