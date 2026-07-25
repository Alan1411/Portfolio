"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function NavLinks({ isAdmin, user }: { isAdmin?: boolean; user?: { email: string; full_name?: string | null } | null }) {
  const pathname = usePathname();
  const allLinks = isAdmin ? [...links, { href: "/admin", label: "Admin" }] : links;

  return (
    <>
      <ul className="nav-links">
        {allLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      {user ? (
        <div className="nav-user">
          <span className="nav-user-name">{user.full_name || user.email}</span>
          <LogoutButton className="nav-logout-btn" />
        </div>
      ) : (
        <Link href="/login" className="nav-login-btn">Log In</Link>
      )}
    </>
  );
}
