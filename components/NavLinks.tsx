"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/tools", label: "Tools" },
  { href: "/skills", label: "Skills" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function NavLinks({ isAdmin, user }: { isAdmin?: boolean; user?: { email: string; full_name?: string | null } | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const allLinks = isAdmin ? [...links, { href: "/admin", label: "Admin" }] : links;

  // Menü bei Routenwechsel schließen
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <ul className="nav-links">
        {allLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href} className="nav-link-item">
              <Link href={link.href} className={active ? "active" : ""}>
                {link.label}
              </Link>
              {active && <motion.span className="nav-link-underline" layoutId="nav-underline" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            </li>
          );
        })}
      </ul>
      <div className="nav-desktop-actions">
        {user ? (
          <div className="nav-user">
            <span className="nav-user-name">{user.full_name || user.email}</span>
            <LogoutButton className="nav-logout-btn" />
          </div>
        ) : (
          <Link href="/login" className="nav-login-btn">Log In</Link>
        )}
      </div>

      <button
        type="button"
        className="nav-mobile-toggle"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-mobile-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul>
              {allLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={pathname === link.href ? "active" : ""}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="nav-mobile-user">
              {user ? (
                <>
                  <span className="nav-user-name">{user.full_name || user.email}</span>
                  <LogoutButton className="nav-logout-btn" />
                </>
              ) : (
                <Link href="/login" className="nav-login-btn">Log In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
