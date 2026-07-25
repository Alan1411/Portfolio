"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function NavLinks({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const allLinks = isAdmin ? [...links, { href: "/admin", label: "Admin" }] : links;

  return (
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
  );
}
