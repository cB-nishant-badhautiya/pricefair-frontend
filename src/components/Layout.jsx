import { Link, useLocation } from "react-router-dom";
import styles from "./Layout.module.css";

export function Layout({ children }) {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          PriceFair
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={location.pathname === "/" ? styles.navActive : undefined}>
            Home
          </Link>
          <Link to="/dashboard" className={location.pathname === "/dashboard" ? styles.navActive : undefined}>
            Dashboard
          </Link>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      {!isLanding && (
        <footer className={styles.footer}>
          <span>PriceFair — AI Dynamic Price Fairness Checker · Hackathon</span>
        </footer>
      )}
    </div>
  );
}
