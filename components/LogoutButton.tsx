"use client";

import { useRouter } from "next/navigation";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className={className}
      style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", font: "inherit" }}
    >
      Log Out
    </button>
  );
}
