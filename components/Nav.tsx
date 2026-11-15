"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import styles from "./Nav.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
] as const;

/** /works ichidagi sahifalarda ham "Works" faol ko'rinadi */
const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  // Pastga aylantirganda yashirinadi, tepaga qaytganda chiqadi
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.85);
      setHidden(y > lastY && y > 200);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={[
          styles.nav,
          solid && !open ? styles.solid : "",
          hidden && !open ? styles.hide : "",
        ].join(" ")}
      >
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>

        <nav aria-label="Main">
          <ul className={styles.links}>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={isActive(pathname, l.href) ? styles.active : ""}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </header>

      <div className={`${styles.menu} ${open ? styles.menuOpen : ""}`} aria-hidden={!open}>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={isActive(pathname, l.href) ? styles.active : ""}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
