"use client";

import Link from "next/link";
import Image from "next/image";

export default function ProwashLogo({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const dims = {
    sm: { h: 32, w: 120 },
    md: { h: 44, w: 160 },
    lg: { h: 60, w: 220 },
  }[size];

  return (
    <Link href="/prowash" className="group inline-block">
      <Image
        src="/prowash-logo.png"
        alt="Prowash Logo"
        width={dims.w}
        height={dims.h}
        className="transition-transform duration-200 group-hover:scale-105"
        priority
      />
    </Link>
  );
}
