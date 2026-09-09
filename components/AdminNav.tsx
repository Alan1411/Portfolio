"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/finances", label: "Finances" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/emails", label: "Emails" },
  { href: "/admin/links", label: "Short Links" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/blog", label: "Blog" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`admin-nav-link ${pathname === link.href ? "active" : ""}`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
