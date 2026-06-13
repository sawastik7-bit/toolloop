import { ROUTES } from "@/lib/constants";
import styles from "./Footer.module.css";
import TrackedLink from "./TrackedLink";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <TrackedLink
          href={ROUTES.HOME}
          className={styles.brand}
          aria-label="ToolLoop home"
          label="logo"
          location="footer"
        >
          <span className={styles.logoMark} aria-hidden="true">
            ⬡
          </span>
          <span className={styles.logoText}>ToolLoop</span>
        </TrackedLink>
        <nav className={styles.links} aria-label="Footer navigation">
          <TrackedLink
            href={ROUTES.BROWSE}
            className={styles.link}
            label="Browse"
            location="footer"
          >
            Browse
          </TrackedLink>
          <TrackedLink
            href={ROUTES.LIST_NEW_TOOL}
            className={styles.link}
            label="List a tool"
            location="footer"
          >
            List a tool
          </TrackedLink>
          <TrackedLink
            href={ROUTES.SAVED}
            className={styles.link}
            label="Dashboard"
            location="footer"
          >
            Dashboard
          </TrackedLink>
          <TrackedLink
            href={ROUTES.LLMS_TXT}
            className={styles.link}
            label="llms.txt"
            location="footer"
          >
            llms.txt
          </TrackedLink>
        </nav>
        <p className={styles.note}>Community tool lending · No money changes hands.</p>
      </div>
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} ToolLoop. All rights reserved.</p>
      </div>
    </footer>
  );
}
