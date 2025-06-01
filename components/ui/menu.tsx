"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function MenuTab() {
  const pathname = usePathname();
  return (
    <div className="w-full bg-[red] p-4">
      <div className="flex gap-2">
        <Link href={"/"}>Menu</Link>
        <ChevronRight></ChevronRight>
        <Link
          href={
            pathname.includes("non-professional")
              ? "/type/non-professional"
              : "/type/professional"
          }
        >
          {pathname.includes("non-professional")
            ? "Non-professional"
            : "Professional"}
        </Link>
      </div>
    </div>
  );
}
