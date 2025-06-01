"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function MenuTab() {
  const pathname = usePathname();
  return (
    <div className="w-full bg-white border shadow-black p-4">
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

        <ChevronRight className={`${pathname.includes("exam") ? "" : "hidden"}`}></ChevronRight>
        
        <Link
          href={
            pathname.includes("exam")
              ? "/type/non-professional/exam"
              : "/type/professional/exam"
          }
        >
          {pathname.includes("exam") ? (
            <>{pathname.includes("exam") ? "Exam" : ""}</>
          ) : (
            <></>
          )}
        </Link>
      </div>
    </div>
  );
}
